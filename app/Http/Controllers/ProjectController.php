<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectInvitationResource;
use App\Enum\RolesEnum;
use App\Models\TaskLabel;

class ProjectController extends Controller {
    protected $projectService;

    public function __construct(ProjectService $projectService) {
        $this->projectService = $projectService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $filters = request()->all();
        $query = $this->projectService->getProjects($user, $filters);

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");
        $perPage = request("per_page", 10);
        $page = request("page", 1);

        $projects = $query->with(['tasks' => function ($query) {
            $query->latest()->limit(5)->with('labels');
        }])
            ->withCount(['tasks as total_tasks', 'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        return Inertia::render('Project/Index', [
            'projects' => ProjectResource::collection($projects)->additional([
                'permissions' => $projects->map(function ($project) use ($user) {
                    return [
                        'id' => $project->id,
                        'canEditProject' => $project->canEditProject($user),
                    ];
                })->pluck('canEditProject', 'id'),
            ]),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'activeTab' => request()->query('tab', 'overview'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request) {
        $data = $request->validated();
        $project = $this->projectService->storeProject($data);

        // Get the authenticated user
        $user = Auth::user();

        // Attach user to project with ProjectManager role
        $project->invitedUsers()->attach($user->id, [
            'status' => 'accepted',
            'role' => RolesEnum::ProjectManager->value,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Assign ProjectManager role to user if they don't have it
        if (!$user->hasRole(RolesEnum::ProjectManager->value)) {
            $user->assignRole(RolesEnum::ProjectManager->value);
        }

        return to_route('project.index')->with('success', "Project '{$project->name}' created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project) {
        $user = Auth::user();
        if (!$project->acceptedUsers()->where('user_id', $user->id)->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])->exists()) {
            abort(403, 'You are not authorized to view this project.');
        }

        // Check if user is trying to access invite tab while being a project member
        $requestedTab = request()->query('tab', 'tasks');
        if ($requestedTab === 'invite' && $project->isProjectMember($user)) {
            abort(403, 'Project members cannot access the invite section.');
        }

        // Fetch label options for the filter
        $labelOptions = TaskLabel::all()->map(function ($label) {
            return ['value' => $label->id, 'label' => $label->name];
        });

        // Ensure sorting parameters are explicitly set
        $filters = request()->all();
        $filters['sort_field'] = request('sort_field', 'created_at');
        $filters['sort_direction'] = request('sort_direction'); // No default
        $filters['per_page'] = (int) request('per_page', 10);
        $filters['page'] = (int) request('page', 1);

        $tasks = $this->projectService->getProjectWithTasks($project, $filters);

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project->load(['acceptedUsers'])),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
            'activeTab' => request()->query('tab', 'tasks'),
            'labelOptions' => $labelOptions,
            'permissions' => [
                'canInviteUsers' => $project->canInviteUsers($user),
                'canEditProject' => $project->canEditProject($user),
                'canManageTasks' => $project->canManageTask($user),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'You are not authorized to edit this project.');
        }

        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'You are not authorized to update this project.');
        }

        $data = $request->validated();
        $this->projectService->updateProject($project, $data);

        return to_route('project.index')->with('success', "Project '{$project->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project) {
        $user = Auth::user();
        if (!$project->canManage($user)) {
            abort(403, 'You are not authorized to delete this project.');
        }

        $this->projectService->deleteProject($project);

        return to_route('project.index')->with('success', "Project '{$project->name}' deleted successfully.");
    }

    public function inviteUser(Request $request, Project $project) {
        $request->validate(['email' => 'required|email']);

        $result = $this->projectService->handleInvitation($project, $request->email);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function showInvitations(Request $request) {
        $invitations = $this->projectService->getPendingInvitations(Auth::user(), $request->all());

        return Inertia::render('Project/Invite', [
            'invitations' => ProjectInvitationResource::collection($invitations),
            'success' => session('success'),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function acceptInvitation(Project $project) {
        $this->projectService->updateInvitationStatus($project, Auth::user(), 'accepted');
        return redirect()->back()->with('success', 'Invitation accepted.');
    }

    public function rejectInvitation(Project $project) {
        $this->projectService->updateInvitationStatus($project, Auth::user(), 'rejected');
        return redirect()->back()->with('success', 'Invitation rejected.');
    }

    public function leaveProject(Project $project) {
        $result = $this->projectService->leaveProject($project, Auth::user());

        if ($result['success']) {
            return to_route('dashboard')->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function checkRole(Project $project) {
        $user = Auth::user();
        return response()->json([
            'isProjectMember' => $project->isProjectMember($user),
        ]);
    }

    public function kickMembers(Request $request, Project $project) {
        $user = Auth::user();

        if (!$project->canKickProjectMember($user)) {
            abort(403, 'You are not authorized to kick members from this project.');
        }

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $userIds = $request->user_ids;

        // Check if trying to kick project managers without permission
        $projectManagers = $project->acceptedUsers()
            ->whereIn('user_id', $userIds)
            ->where('role', RolesEnum::ProjectManager->value)
            ->exists();

        if ($projectManagers && !$project->canKickProjectManager($user)) {
            abort(403, 'You are not authorized to kick project managers.');
        }

        $result = $this->projectService->kickMembers($project, $userIds);

        return back()->with('success', $result['message']);
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectInvitationResource;

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

        $projects = $query->with(['tasks' => function ($query) {
            $query->latest()->limit(5);
        }])
            ->withCount(['tasks as total_tasks', 'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->orderBy($sortField, $sortDirection)
            ->paginate(request('per_page', 10))
            ->withQueryString();

        return Inertia::render('Project/Index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
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
        $this->projectService->storeProject($data);

        return to_route('project.index')->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project) {
        $user = Auth::user();
        if ($user->id !== $project->created_by && !$project->acceptedUsers->contains($user)) {
            abort(403, 'You are not authorized to view this project.');
        }

        $filters = request()->all();
        $tasks = $this->projectService->getProjectWithTasks($project, $filters);

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project->load(['acceptedUsers'])),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project) {
        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project) {
        $data = $request->validated();
        $this->projectService->updateProject($project, $data);

        return to_route('project.index')->with('success', "Project '{$project->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project) {
        $this->projectService->deleteProject($project);

        return to_route('project.index')->with('success', "Project '{$project->name}' deleted successfully.");
    }

    public function inviteUser(Request $request, Project $project) {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'User does not exist.');
        }

        // Check if there's already an invitation for this user and project
        $existingInvitation = $project->invitedUsers()
            ->where('user_id', $user->id)
            ->first();

        // If the user has a rejected invitation, update it to pending instead of creating a new one
        if ($existingInvitation && $existingInvitation->pivot->status === 'rejected') {
            $project->invitedUsers()->updateExistingPivot($user->id, [
                'status' => 'pending',
                'updated_at' => now(),
            ]);
            return back()->with('success', 'User re-invited successfully.');
        }

        // If no invitation exists, create a new one
        if (!$existingInvitation) {
            $project->invitedUsers()->attach($user->id, [
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            return back()->with('success', 'User invited successfully.');
        }

        return back()->with('error', 'This user has already been invited.');
    }

    public function showInvitations(Request $request) {
        $user = Auth::user();

        // Initialize the query for pending invitations
        $query = $user->projectInvitations()->wherePivot('status', 'pending');

        // Apply filtering based on query parameters
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('status')) {
            $statuses = $request->input('status');
            if (is_array($statuses)) {
                $query->wherePivotIn('status', $statuses);
            } else {
                $query->wherePivot('status', $statuses);
            }
        }

        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $invitations = $query->paginate($request->input('per_page', 10))->withQueryString();

        return Inertia::render('Project/Invite', [
            'invitations' => ProjectInvitationResource::collection($invitations),
            'success' => session('success'),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function acceptInvitation(Project $project) {
        $user = Auth::user();

        // Update the invitation status to 'accepted'
        $project->invitedUsers()->updateExistingPivot($user->id, ['status' => 'accepted']);

        return redirect()->back()->with('success', 'Invitation accepted.');
    }

    public function rejectInvitation(Project $project) {
        $user = Auth::user();

        // Update the invitation status to 'rejected'
        $project->invitedUsers()->updateExistingPivot($user->id, ['status' => 'rejected']);

        return redirect()->back()->with('success', 'Invitation rejected.');
    }
}

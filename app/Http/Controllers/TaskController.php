<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use App\Models\Task;
use Inertia\Inertia;
use App\Models\Project;
use App\Services\TaskService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskLabelResource;
use App\Models\TaskLabel;

class TaskController extends Controller {
    protected $taskService;

    public function __construct(TaskService $taskService) {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $filters = request()->all();
        $tasks = $this->taskService->getTasks($user, $filters);

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'labelOptions' => $this->taskService->getLabelOptions(),
            'projectOptions' => $this->taskService->getProjectOptions($user),
            'permissions' => [
                'canManageTasks' => $tasks->first()?->project->canManageTask($user),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        $user = Auth::user();
        $projectId = request('project_id');
        $selectedProject = $projectId ? Project::findOrFail($projectId) : null;

        // Get accessible projects for the user
        $projects = Project::query()
            ->whereHas('invitedUsers', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('status', 'accepted')
                    ->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value]);
            })
            ->orderBy('name', 'asc')
            ->get();

        // Should they be restricted to self-assignment?
        $canAssignOthers = !$selectedProject || !$selectedProject->isProjectMember($user);

        // Fetch initial users if project is selected
        $users = $selectedProject ? $this->getProjectUsers($selectedProject) : collect();

        // Fetch both generic labels and project-specific labels if a project is selected
        $labelsQuery = TaskLabel::whereNull('project_id');
        if ($selectedProject) {
            $labelsQuery->orWhere('project_id', $selectedProject->id);
        }
        $labels = $labelsQuery->orderBy('name', 'asc')->get();

        return Inertia::render('Task/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
            'canAssignOthers' => $canAssignOthers,
            'currentUserId' => $user->id,
            'selectedProjectId' => $selectedProject?->id,
            'fromProjectPage' => (bool)$projectId,
        ]);
    }

    /**
     * Get users that belong to a project
     */
    private function getProjectUsers(?Project $project): \Illuminate\Support\Collection {
        if (!$project) {
            return collect();
        }

        $user = Auth::user();

        // If user is a project member, only return themselves
        if ($project->isProjectMember($user)) {
            return collect([$user]);
        }

        // Otherwise, return all project users (for project managers)
        return $project->acceptedUsers()
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get users for a specific project (API endpoint)
     */
    public function getUsers(Project $project) {
        $user = Auth::user();

        if (!$project->acceptedUsers()->where('user_id', $user->id)->exists()) {
            abort(403, 'You are not authorized to view project users.');
        }

        $users = $this->getProjectUsers($project);
        return response()->json([
            'users' => [
                'data' => UserResource::collection($users)
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request) {
        $data = $request->validated();
        $user = Auth::user();
        $project = Project::findOrFail($data['project_id']);

        // Validate that user is a member or manager of the project
        if (!$project->acceptedUsers()
            ->where('user_id', $user->id)
            ->whereIn('role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])
            ->exists()) {
            abort(403, 'You cannot create tasks for this project.');
        }

        // If user is a project member, force self-assignment
        if ($project->isProjectMember($user)) {
            $data['assigned_user_id'] = $user->id;
        }

        $this->taskService->storeTask($data);
        return to_route('task.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task) {
        return Inertia::render('Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canEditTask($user, $task)) {
            abort(403, 'You are not authorized to edit this task.');
        }

        // Project managers can always change assignee
        $canChangeAssignee = !$project->isProjectMember($user);

        $task->load('labels');
        // We only need the current project for edit mode
        $projects = Project::where('id', $project->id)->get();

        // Get users based on role (similar to create form)
        $users = $this->getProjectUsers($project);

        $projectId = $task->project_id;
        $labels = TaskLabel::whereNull('project_id')
            ->orWhere('project_id', $projectId)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
            'canChangeAssignee' => $canChangeAssignee,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canEditTask($user, $task)) {
            abort(403, 'You are not authorized to edit this task.');
        }

        // If user is not a project manager, prevent changing the assignee
        if (!$project->canManageTask($user)) {
            unset($request['assigned_user_id']);
        }

        $data = $request->validated();
        $this->taskService->updateTask($task, $data);

        return to_route('task.index')->with('success', "Task '{$task->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task) {
        $user = Auth::user();
        $project = $task->project;

        if (!$project->canDeleteTask($user)) {
            abort(403, 'You are not authorized to delete this task.');
        }

        $this->taskService->deleteTask($task);

        return to_route('task.index')->with('success', "Task '{$task->name}' deleted successfully.");
    }

    public function myTasks() {
        $user = Auth::user();
        $tasks = $this->taskService->getMyTasks($user, request()->all());

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'labelOptions' => $this->taskService->getLabelOptions(),
            'projectOptions' => $this->taskService->getProjectOptions($user),
            'permissions' => [
                'canManageTasks' => $tasks->first()?->project->canManageTask($user),
            ],
        ]);
    }

    public function assignToMe(Task $task) {
        $user = Auth::user();

        if (!$task->canBeAssignedBy($user)) {
            abort(403, 'You cannot assign this task.');
        }

        $task->update([
            'assigned_user_id' => $user->id,
            'updated_by' => $user->id
        ]);

        return back()->with('success', 'Task assigned successfully.');
    }

    public function unassign(Task $task) {
        $user = Auth::user();

        if (!$task->canBeUnassignedBy($user)) {
            abort(403, 'You cannot unassign this task.');
        }

        $task->update([
            'assigned_user_id' => null,
            'updated_by' => $user->id
        ]);

        return back()->with('success', 'Task unassigned successfully.');
    }
}

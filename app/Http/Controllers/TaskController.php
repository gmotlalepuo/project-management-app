<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
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
use Carbon\Carbon;

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
        $query = $this->taskService->getTasks($user, $filters);

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $tasks = $query->with('labels')->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        // Fetch label options for the filter
        $labelOptions = TaskLabel::all()->map(function ($label) {
            return ['value' => $label->id, 'label' => $label->name];
        });

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'labelOptions' => $labelOptions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        // Fetch labels that are either generic or related to a project (if selected)
        $projectId = request('project_id'); // Optional project filter from the request
        $labels = TaskLabel::whereNull('project_id')
            ->orWhere('project_id', $projectId)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Task/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request) {
        $data = $request->validated();
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
        $task->load('labels'); // Ensure labels are loaded
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        // Fetch labels that are either generic or related to a project (if selected)
        $projectId = $task->project_id; // Use the task's project_id
        $labels = TaskLabel::whereNull('project_id')
            ->orWhere('project_id', $projectId)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'labels' => TaskLabelResource::collection($labels),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task) {
        $data = $request->validated();
        $this->taskService->updateTask($task, $data);

        return to_route('task.index')->with('success', "Task '{$task->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task) {
        $this->taskService->deleteTask($task);

        return to_route('task.index')->with('success', "Task '{$task->name}' deleted successfully.");
    }

    public function myTasks() {
        $user = Auth::user();
        $filters = request()->all();
        $query = Task::where('assigned_user_id', $user->id)
            ->whereHas('project', function ($query) use ($user) {
                $query->visibleToUser($user->id);
            });

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (isset($filters['name'])) {
            $query->where("name", "like", "%" . $filters['name'] . "%");
        }
        if (isset($filters['status'])) {
            $query->where("status", $filters['status']);
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Task/Index', [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
}

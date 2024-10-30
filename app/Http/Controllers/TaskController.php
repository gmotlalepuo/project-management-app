<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;
use Carbon\Carbon;

class TaskController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $query = Task::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // Filter by task name
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        // Filter by project name with a relation to project_id
        if (request("project_name")) {
            $query->whereHas("project", function ($query) {
                $query->where("name", "like", "%" . request("project_name") . "%");
            });
        }

        if (request()->has('status')) {
            // Check if status is an array and apply filtering
            $statuses = request()->input('status');
            if (is_array($statuses)) {
                $query->whereIn("status", $statuses); // Use whereIn for multiple values
            } else {
                $query->where("status", $statuses);
            }
        }

        if (request()->has('priority')) {
            // Check if priority is an array and apply filtering
            $priorities = request()->input('priority');
            if (is_array($priorities)) {
                $query->whereIn("priority", $priorities); // Use whereIn for multiple values
            } else {
                $query->where("priority", $priorities);
            }
        }

        if (request("due_date")) {
            $dueDateRange = request("due_date");
            $startDate = Carbon::parse($dueDateRange[0])->startOfDay();
            $endDate = Carbon::parse($dueDateRange[1])->endOfDay();

            $query->whereBetween("due_date", [$startDate, $endDate]);
        }

        // Filter by "Created By" user name with a relation to created_by (User model)
        if (request("created_by_name")) {
            $query->whereHas("createdBy", function ($query) {
                $query->where("name", "like", "%" . request("created_by_name") . "%");
            });
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return Inertia::render('Task/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request) {
        $data = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(10), 'public');
        }

        Task::create($data);

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
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task) {
        $data = $request->validated();
        $name = $task->name;
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(10), 'public');
        }
        $task->update($data);

        return to_route('task.index')->with('success', "Task '$name' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task) {
        $name = $task->name;

        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        $task->delete();

        return to_route('task.index')->with('success', "Task '$name' deleted successfully.");
    }

    public function myTasks() {
        $user = Auth::user();
        $query = Task::query()->where('assigned_user_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
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

<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\KanbanColumn;
use App\Enum\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Requests\StoreKanbanColumnRequest;
use App\Models\TaskStatus;
use Illuminate\Support\Str;

class KanbanController extends Controller {
  public function show(Project $project) {
    $user = Auth::user();

    // Get user's role from project's accepted users
    $userRole = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->first()
      ->pivot
      ->role;

    // Add eager loading for tasks and their relationships
    $columns = $project->kanbanColumns()
      ->orderBy('order')
      ->with([
        'tasks' => function ($query) {
          $query->with([
            'labels',
            'assignedUser',
            'project',
            'createdBy',
            'updatedBy'
          ]);
        }
      ])
      ->get();

    return Inertia::render('Project/Kanban', [
      'project' => new ProjectResource($project),
      'columns' => $columns->map(function ($column) {
        return [
          'id' => $column->id,
          'name' => $column->name,
          'order' => $column->order,
          'project_id' => $column->project_id,
          'is_default' => $column->is_default,
          'maps_to_status' => $column->maps_to_status,
          'color' => $column->color,
          'tasks' => TaskResource::collection($column->tasks)->resource, // Add ->resource to get raw array
        ];
      }),
      'permissions' => [
        'canManageTasks' => in_array($userRole, [
          RolesEnum::ProjectManager->value,
          RolesEnum::ProjectMember->value
        ]),
        'canManageBoard' => $userRole === RolesEnum::ProjectManager->value,
      ],
    ]);
  }

  public function updateColumnOrder(Request $request, Project $project) {
    $user = Auth::user();
    $userRole = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->first()
      ->pivot
      ->role;

    if ($userRole !== RolesEnum::ProjectManager->value) {
      abort(403, 'You are not authorized to manage the kanban board.');
    }

    $request->validate([
      'columns' => 'required|array',
      'columns.*.id' => 'required|exists:kanban_columns,id',
      'columns.*.order' => 'required|integer|min:0',
    ]);

    foreach ($request->columns as $column) {
      KanbanColumn::where('id', $column['id'])
        ->where('project_id', $project->id)
        ->update(['order' => $column['order']]);
    }

    return back();
  }

  public function moveTask(Request $request, Task $task) {
    $user = Auth::user();
    $project = $task->project;
    $userRole = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->first()
      ->pivot
      ->role;

    // Project members can only move their own tasks
    if ($userRole === RolesEnum::ProjectMember->value && $task->assigned_user_id !== $user->id) {
      abort(403, 'You can only move tasks assigned to you.');
    }

    // Project managers can move any task
    if (!in_array($userRole, [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value])) {
      abort(403, 'You are not authorized to move tasks.');
    }

    $request->validate([
      'column_id' => 'required|exists:kanban_columns,id',
    ]);

    $newColumn = KanbanColumn::where('id', $request->column_id)
      ->where('project_id', $project->id)
      ->firstOrFail();

    // Update task status based on column's task status
    if ($newColumn->task_status_id) {
      $task->status_id = $newColumn->task_status_id;
      // Record in status history
      $task->statusHistory()->attach($newColumn->task_status_id);
    }

    $task->kanban_column_id = $newColumn->id;
    $task->save();

    return back();
  }

  public function store(StoreKanbanColumnRequest $request, Project $project) {
    $user = Auth::user();
    $userRole = $project->getUserProjectRole($user);

    if ($userRole !== RolesEnum::ProjectManager->value) {
      abort(403);
    }

    $data = $request->validated();

    // Create new task status
    $taskStatus = TaskStatus::create([
      'name' => $data['status_name'],
      'slug' => Str::slug($data['status_name']),
      'color' => $data['status_color'],
      'project_id' => $project->id,
    ]);

    // Create new kanban column
    $lastOrder = $project->kanbanColumns()->max('order') ?? -1;

    $column = $project->kanbanColumns()->create([
      'name' => $data['name'],
      'color' => $data['color'],
      'order' => $lastOrder + 1,
      'task_status_id' => $taskStatus->id,
    ]);

    return back()->with('success', 'Column created successfully.');
  }

  public function updateColumnsOrder(Request $request, Project $project) {
    $request->validate([
      'columns' => 'required|array',
      'columns.*.id' => 'required|exists:kanban_columns,id',
      'columns.*.order' => 'required|integer|min:0',
    ]);

    foreach ($request->columns as $column) {
      $project->kanbanColumns()
        ->where('id', $column['id'])
        ->update(['order' => $column['order']]);
    }

    return back();
  }
}

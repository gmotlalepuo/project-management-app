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
use App\Models\TaskStatus;

class KanbanController extends Controller {
  public function show(Project $project) {
    $user = Auth::user();
    $userRole = $project->getUserProjectRole($user);

    // Get all available statuses for this project (default + project-specific)
    $statuses = TaskStatus::where('is_default', true)
      ->whereNull('project_id')
      ->orWhere('project_id', $project->id)
      ->orderBy('name')
      ->get();

    // Create or get columns for each status
    $statuses->each(function ($status) use ($project) {
      $project->kanbanColumns()->firstOrCreate(
        ['task_status_id' => $status->id],
        [
          'name' => $status->name,
          'color' => $status->color,
          'order' => $project->kanbanColumns()->max('order') + 1,
          'is_default' => $status->is_default,
        ]
      );
    });

    // Get columns with tasks
    $columns = $project->kanbanColumns()
      ->orderBy('order')
      ->with(['tasks.labels', 'tasks.assignedUser', 'tasks.project', 'tasks.createdBy', 'tasks.updatedBy', 'taskStatus'])
      ->get();

    return Inertia::render('Project/Kanban', [
      'project' => new ProjectResource($project),
      'columns' => $columns->map(function ($column) {
        return [
          'id' => $column->id,
          'name' => $column->name,
          'order' => $column->order,
          'color' => $column->color,
          'is_default' => $column->is_default,
          'taskStatus' => $column->taskStatus,
          'tasks' => TaskResource::collection($column->tasks)->resource,
        ];
      }),
      'permissions' => [
        'canManageTasks' => in_array($userRole, [
          RolesEnum::ProjectManager->value,
          RolesEnum::ProjectMember->value
        ]),
        'canManageBoard' => $userRole === RolesEnum::ProjectManager->value,
      ],
      'success' => session('success'),
      'error' => session('error'),
    ]);
  }

  public function updateColumnOrder(Request $request, Project $project) {
    $user = Auth::user();
    $userRole = $project->getUserProjectRole($user);

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
    $userRole = $project->getUserProjectRole($user);

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

    // Only update status if it's different from current status
    if ($newColumn->task_status_id && $task->status_id !== $newColumn->task_status_id) {
      $task->status_id = $newColumn->task_status_id;
      $task->save();

      // Record in status history if not already recorded
      if (!$task->statusHistory()->where('task_status_id', $newColumn->task_status_id)->exists()) {
        $task->statusHistory()->attach($newColumn->task_status_id);
      }
    }

    $task->kanban_column_id = $newColumn->id;
    $task->save();

    try {
      return back()->with('success', 'Task moved successfully');
    } catch (\Exception $e) {
      return back()->with('error', 'Failed to move task. Please try again.');
    }
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

    try {
      return back()->with('success', 'Column order updated successfully');
    } catch (\Exception $e) {
      return back()->with('error', 'Failed to update column order');
    }
  }
}

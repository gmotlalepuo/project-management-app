<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Task;
use Illuminate\Support\Str;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskService extends BaseService {
  use FilterableTrait, SortableTrait;

  public function getTasks($user, array $filters) {
    $query = Task::visibleToUser($user->id)->with('labels');

    // Apply filters
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status']);
    }
    if (isset($filters['priority'])) {
      $this->applyPriorityFilter($query, $filters['priority']);
    }
    if (isset($filters['project_name'])) {
      $this->applyRelationFilter($query, 'project', 'name', $filters['project_name']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'due_date');
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }

    $basicFilters = $this->getBasicFilters($filters);
    $query = $this->applySorting($query, $basicFilters['sort_field'], $basicFilters['sort_direction'], 'tasks');

    return $query->paginate($basicFilters['per_page'], ['*'], 'page', $basicFilters['page']);
  }

  public function storeTask($data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();
    $data['due_date'] = $this->formatDate($data['due_date'] ?? null);

    if (isset($data['image'])) {
      $data['image_path'] = $this->handleImageUpload($data['image'], 'task');
    }

    $task = Task::create($data);

    if (isset($data['label_ids']) && is_array($data['label_ids'])) {
      $task->labels()->sync($data['label_ids']);
    }

    return $task;
  }

  public function updateTask($task, $data) {
    $data['updated_by'] = Auth::id();

    if (isset($data['due_date'])) {
      $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
    } else {
      $data['due_date'] = null;
    }

    if (isset($data['image'])) {
      if ($task->image_path) {
        Storage::disk('public')->deleteDirectory(dirname($task->image_path));
      }
      $data['image_path'] = $data['image']->store('task/' . Str::random(10), 'public');
    }

    $task->update($data);

    if (isset($data['label_ids']) && is_array($data['label_ids'])) {
      $task->labels()->sync($data['label_ids']);
    } else {
      $task->labels()->detach();
    }

    return $task;
  }

  public function deleteTask($task) {
    if ($task->image_path) {
      Storage::disk('public')->deleteDirectory(dirname($task->image_path));
    }

    $task->labels()->detach();
    $task->delete();
  }

  public function getMyTasks($user, $filters) {
    $query = Task::where('assigned_user_id', $user->id)
      ->whereHas('project', function ($query) use ($user) {
        $query->visibleToUser($user->id);
      });

    // Basic pagination and sorting
    $perPage = $filters['per_page'] ?? 10;
    $page = $filters['page'] ?? 1;
    $sortField = $filters['sort_field'] ?? 'created_at';
    $sortDirection = $filters['sort_direction'] ?? 'desc';

    // Simple sorting
    $query->orderBy($sortField, $sortDirection);

    return $query->paginate($perPage, ['*'], 'page', $page);
  }
}

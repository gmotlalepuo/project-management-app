<?php

namespace App\Services;

use App\Models\Project;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\TaskLabel;
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
    if (isset($filters['project_id'])) {
      $query->where('project_id', $filters['project_id']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'due_date');
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }

    return $this->paginateAndSort($query, $filters, 'tasks');
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
      ->with(['labels', 'project', 'assignedUser'])
      ->whereHas('project', function ($query) use ($user) {
        $query->visibleToUser($user->id);
      });

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
    if (isset($filters['project_id'])) {
      $query->where('project_id', $filters['project_id']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'due_date');
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }

    return $this->paginateAndSort($query, $filters, 'tasks');
  }

  public function getProjectOptions($user) {
    return $user->projects()
      ->orderBy('name')
      ->get()
      ->map(fn($project) => [
        'value' => (string)$project->id,
        'label' => $project->name
      ]);
  }

  public function getLabelOptions(?Project $project = null) {
    $query = TaskLabel::query();

    if ($project) {
      $query->where(function ($q) use ($project) {
        $q->whereNull('project_id')
          ->orWhere('project_id', $project->id);
      });
    }

    return $query->orderBy('name')
      ->get()
      ->map(fn($label) => [
        'value' => (string)$label->id,
        'label' => $label->name
      ]);
  }
}

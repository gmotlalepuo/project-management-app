<?php

namespace App\Services;

use App\Models\Project;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\TaskLabel;
use App\Models\TaskStatus;
use Illuminate\Support\Str;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use HTMLPurifier;

class TaskService extends BaseService {
  use FilterableTrait, SortableTrait;

  public function getTasks($user, array $filters) {
    $query = Task::visibleToUser($user->id)
      ->with([
        'labels',
        'status',
        'project',
        'assignedUser'
      ]);

    // Apply filters
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'task');
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

    // Sanitize HTML content
    if (isset($data['description'])) {
      $purifier = new HTMLPurifier();
      $data['description'] = $purifier->purify($data['description']);
    }

    if (isset($data['image'])) {
      $data['image_path'] = $this->handleImageUpload($data['image'], 'task');
    }

    if (!isset($data['status_id'])) {
      $defaultStatus = TaskStatus::where('slug', 'pending')
        ->where(function ($query) use ($data) {
          $query->where('project_id', $data['project_id'])
            ->orWhere(function ($q) {
              $q->whereNull('project_id')
                ->where('is_default', true);
            });
        })
        ->first();

      if ($defaultStatus) {
        $data['status_id'] = $defaultStatus->id;
      }
    }

    $task = Task::create($data);

    // Record initial status in history
    if ($task->status_id) {
      $task->statusHistory()->attach($task->status_id);
    }

    if (isset($data['label_ids']) && is_array($data['label_ids'])) {
      $task->labels()->sync($data['label_ids']);
    }

    return $task;
  }

  public function updateTask($task, $data) {
    $data['updated_by'] = Auth::id();

    // Sanitize HTML content
    if (isset($data['description'])) {
      $purifier = new HTMLPurifier();
      $data['description'] = $purifier->purify($data['description']);
    }

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
      ->with([
        'labels',
        'status',
        'project',
        'assignedUser'
      ])
      ->whereHas('project', function ($query) use ($user) {
        $query->visibleToUser($user->id);
      });

    // Apply filters
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'task');
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

  public function getOptions(?Project $project = null) {
    return [
      'projectOptions' => $this->getProjectOptions(Auth::user()),
      'labelOptions' => $this->getLabelOptions($project),
      'statusOptions' => $this->getStatusOptions($project),
    ];
  }

  public function getStatusOptions(?Project $project = null) {
    $query = TaskStatus::query();

    if ($project) {
      // For project-specific views, get default statuses and project's custom statuses
      $query->where(function ($q) use ($project) {
        $q->where('is_default', true)
          ->whereNull('project_id')
          ->orWhere('project_id', $project->id);
      });
    } else {
      // For global views, get all possible statuses
      $query->where(function ($q) {
        $q->where('is_default', true)
          ->orWhereNotNull('project_id');
      });
    }

    return $query->orderBy('name')
      ->get()
      ->map(function ($status) {
        return [
          'value' => (string)$status->id,
          'label' => $status->name,
        ];
      });
  }
}

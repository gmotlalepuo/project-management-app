<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskLabel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskService {
  public function getTasks($user, $filters) {
    $query = Task::visibleToUser($user->id)->with('labels'); // Ensure labels are loaded

    // Apply filters
    if (isset($filters['name'])) {
      $query->where("name", "like", "%" . $filters['name'] . "%");
    }
    if (isset($filters['project_name'])) {
      $query->whereHas("project", function ($query) use ($filters) {
        $query->where("name", "like", "%" . $filters['project_name'] . "%");
      });
    }
    if (isset($filters['status'])) {
      $statuses = $filters['status'];
      if (is_array($statuses)) {
        $query->whereIn("status", $statuses);
      } else {
        $query->where("status", $statuses);
      }
    }
    if (isset($filters['priority'])) {
      $priorities = $filters['priority'];
      if (is_array($priorities)) {
        $query->whereIn("priority", $priorities);
      } else {
        $query->where("priority", $priorities);
      }
    }
    if (isset($filters['due_date'])) {
      $dueDateRange = $filters['due_date'];
      $startDate = Carbon::parse($dueDateRange[0])->startOfDay();
      $endDate = Carbon::parse($dueDateRange[1])->endOfDay();
      $query->whereBetween("due_date", [$startDate, $endDate]);
    }
    if (isset($filters['created_by_name'])) {
      $query->whereHas("createdBy", function ($query) use ($filters) {
        $query->where("name", "like", "%" . $filters['created_by_name'] . "%");
      });
    }
    if (isset($filters['label_ids'])) {
      $labelIds = $filters['label_ids'];
      if (is_array($labelIds)) {
        $query->whereHas("labels", function ($query) use ($labelIds) {
          $query->whereIn("id", $labelIds);
        });
      } else {
        $query->whereHas("labels", function ($query) use ($labelIds) {
          $query->where("id", $labelIds);
        });
      }
    }

    return $query;
  }

  public function storeTask($data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();

    if (isset($data['due_date'])) {
      $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
    } else {
      $data['due_date'] = null;
    }

    if (isset($data['image'])) {
      $data['image_path'] = $data['image']->store('task/' . Str::random(10), 'public');
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
}

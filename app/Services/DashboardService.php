<?php

namespace App\Services;

use App\Models\Task;
use Carbon\Carbon;

class DashboardService {
  public function getActiveTasks($user, $filters) {
    // Start with tasks from projects where user is a member
    $query = Task::whereHas('project', function ($query) use ($user) {
      $query->where('created_by', $user->id)
        ->orWhereHas('acceptedUsers', function ($q) use ($user) {
          $q->where('user_id', $user->id)
            ->where('status', 'accepted');
        });
    })
      ->whereIn('status', ['pending', 'in_progress'])
      ->where('assigned_user_id', $user->id);

    // Apply filters
    if (isset($filters['name'])) {
      $query->where('name', 'like', '%' . $filters['name'] . '%');
    }

    if (isset($filters['project_name'])) {
      $query->whereHas('project', function ($query) use ($filters) {
        $query->where('name', 'like', '%' . $filters['project_name'] . '%');
      });
    }

    if (isset($filters['status'])) {
      $statuses = $filters['status'];
      if (is_array($statuses)) {
        $query->whereIn('status', $statuses);
      } else {
        $query->where('status', $statuses);
      }
    }

    if (isset($filters['due_date'])) {
      $dueDateRange = $filters['due_date'];
      $startDate = Carbon::parse($dueDateRange[0])->startOfDay();
      $endDate = Carbon::parse($dueDateRange[1])->endOfDay();
      $query->whereBetween('due_date', [$startDate, $endDate]);
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
}

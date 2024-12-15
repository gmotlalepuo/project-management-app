<?php

namespace App\Services;

use App\Models\Task;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;

class DashboardService extends BaseService {
  use FilterableTrait, SortableTrait;

  public function getActiveTasks($user, array $filters) {
    $query = Task::query();

    // Base query
    $query->whereHas('project', function ($query) use ($user) {
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
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['priority'])) {
      $this->applyPriorityFilter($query, $filters['priority']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status']);
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }

    // Handle sorting
    $basicFilters = $this->getBasicFilters($filters);

    $query = $this->applySorting($query, $basicFilters['sort_field'], $basicFilters['sort_direction'], 'tasks');

    return $query;
  }
}

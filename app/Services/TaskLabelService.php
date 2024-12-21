<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TaskLabel;

class TaskLabelService {
  public function getProjectLabels(Project $project, array $filters = []) {
    $query = TaskLabel::where(function ($query) use ($project) {
      $query->whereNull('project_id')
        ->orWhere('project_id', $project->id);
    });

    // Apply filters
    if (!empty($filters['search'])) {
      $query->where('name', 'like', '%' . $filters['search'] . '%');
    }

    if (!empty($filters['variant'])) {
      $query->where('variant', $filters['variant']);
    }

    // Apply sorting
    $sortField = $filters['sort_field'] ?? 'created_at';
    $sortDirection = $filters['sort_direction'] ?? 'desc';
    $query->orderBy($sortField, $sortDirection);

    return $query->paginate($filters['per_page'] ?? 10);
  }

  public function storeLabel(array $data) {
    return TaskLabel::create($data);
  }

  public function updateLabel(TaskLabel $label, array $data) {
    $label->update($data);
    return $label;
  }

  public function deleteLabel(TaskLabel $label) {
    return $label->delete();
  }
}

<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TaskLabel;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;

class TaskLabelService extends BaseService {
  use FilterableTrait, SortableTrait;

  public function getProjectLabels(Project $project, array $filters = []) {
    $query = TaskLabel::where(function ($query) use ($project) {
      $query->whereNull('project_id')
        ->orWhere('project_id', $project->id);
    })->with('createdBy');

    // Get all filter values from the request
    $filters = array_merge([
      'name' => request('name'),
      'variant' => request('variant'),
      'created_by' => request('created_by'),
      'sort_field' => request('sort_field', 'created_at'),
      'sort_direction' => request('sort_direction', 'desc'),
      'per_page' => request('per_page', 10)
    ], $filters);

    // Apply name filter
    if (!empty($filters['name'])) {
      $query->where('name', 'like', '%' . $filters['name'] . '%');
    }

    // Apply variant filter
    if (!empty($filters['variant'])) {
      $query->where('variant', $filters['variant']);
    }

    // Apply sorting
    $query->orderBy($filters['sort_field'], $filters['sort_direction']);

    return $query->paginate($filters['per_page'])->withQueryString();
  }

  public function storeLabel(array $data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();

    return TaskLabel::create($data);
  }

  public function updateLabel(TaskLabel $label, array $data) {
    $data['updated_by'] = Auth::id();
    $label->update($data);

    return $label;
  }

  public function deleteLabel(TaskLabel $label) {
    return $label->delete();
  }
}

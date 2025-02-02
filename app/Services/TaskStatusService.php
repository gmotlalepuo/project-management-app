<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TaskStatus;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TaskStatusService extends BaseService {
  use FilterableTrait, SortableTrait;

  public function getProjectStatuses(Project $project, array $filters = []) {
    $query = TaskStatus::where(function ($query) use ($project) {
      $query->whereNull('project_id')
        ->where('is_default', true)
        ->orWhere('project_id', $project->id);
    })->with('createdBy');

    // Get all filter values from the request
    $filters = array_merge([
      'name' => request('name'),
      'color' => request('color'),
      'created_by' => request('created_by'),
      'sort_field' => request('sort_field', 'created_at'),
      'sort_direction' => request('sort_direction', 'desc'),
      'per_page' => request('per_page', 10)
    ], $filters);

    // Apply name filter
    if (!empty($filters['name'])) {
      $query->where('name', 'like', '%' . $filters['name'] . '%');
    }

    // Apply color filter
    if (!empty($filters['color'])) {
      $query->where('color', $filters['color']);
    }

    // Apply sorting
    $query = $this->applySorting(
      $query,
      $filters['sort_field'],
      $filters['sort_direction'],
      'task_statuses'
    );

    return $query->paginate($filters['per_page'])->withQueryString();
  }

  public function storeStatus(array $data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();
    $data['slug'] = Str::slug($data['name']);

    return TaskStatus::create($data);
  }

  public function updateStatus(TaskStatus $status, array $data) {
    if ($status->is_default) {
      throw new \Exception('Cannot edit default statuses.');
    }

    $data['updated_by'] = Auth::id();
    $data['slug'] = Str::slug($data['name']);
    $status->update($data);

    return $status;
  }

  public function deleteStatus(TaskStatus $status) {
    if ($status->is_default) {
      throw new \Exception('Cannot delete default statuses.');
    }

    if ($status->tasks()->exists()) {
      throw new \Exception('Cannot delete status that has tasks. Please reassign tasks to another status first.');
    }

    return $status->delete();
  }
}

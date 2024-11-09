<?php

namespace App\Services;

use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService {
  public function getProjects($user, $filters) {
    $query = Project::visibleToUser($user->id);

    // Apply filters
    if (isset($filters['name'])) {
      $query->where("name", "like", "%" . $filters['name'] . "%");
    }
    if (isset($filters['status'])) {
      $statuses = $filters['status'];
      if (is_array($statuses)) {
        $query->whereIn("status", $statuses);
      } else {
        $query->where("status", $statuses);
      }
    }
    if (isset($filters['created_at'])) {
      $createdAtRange = $filters['created_at'];
      $startDate = Carbon::parse($createdAtRange[0])->startOfDay();
      $endDate = Carbon::parse($createdAtRange[1])->endOfDay();
      $query->whereBetween("created_at", [$startDate, $endDate]);
    }

    return $query;
  }

  public function storeProject($data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();

    if (isset($data['due_date'])) {
      $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
    } else {
      $data['due_date'] = null;
    }

    if (isset($data['image'])) {
      $data['image_path'] = $data['image']->store('project/' . Str::random(10), 'public');
    }

    return Project::create($data);
  }

  public function updateProject($project, $data) {
    $data['updated_by'] = Auth::id();

    if (isset($data['due_date'])) {
      $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
    } else {
      $data['due_date'] = null;
    }

    if (isset($data['image'])) {
      if ($project->image_path) {
        Storage::disk('public')->deleteDirectory(dirname($project->image_path));
      }
      $data['image_path'] = $data['image']->store('project/' . Str::random(10), 'public');
    }

    $project->update($data);

    return $project;
  }

  public function deleteProject($project) {
    if ($project->image_path) {
      Storage::disk('public')->deleteDirectory(dirname($project->image_path));
    }

    $project->delete();
  }

  public function getProjectWithTasks(Project $project, $filters) {
    $query = $project->tasks();

    // Apply filters
    if (isset($filters['name'])) {
      $query->where("name", "like", "%" . $filters['name'] . "%");
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

    $sortField = $filters['sort_field'] ?? "created_at";
    $sortDirection = $filters['sort_direction'] ?? "desc";

    $tasks = $query->orderBy($sortField, $sortDirection)
      ->paginate(10)
      ->onEachSide(1);

    return $tasks;
  }
}

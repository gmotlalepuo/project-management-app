<?php

namespace App\Services;

use App\Enum\RolesEnum;
use App\Events\ProjectInvitationRequestReceived;
use App\Models\Project;
use App\Models\User;
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

    $sortField = $filters['sort_field'] ?? "created_at";
    $sortDirection = $filters['sort_direction'] ?? "desc";

    $tasks = $query->with('labels')->orderBy($sortField, $sortDirection)
      ->paginate(10)
      ->onEachSide(1);

    return $tasks;
  }

  public function handleInvitation(Project $project, string $email) {
    $user = User::where('email', $email)->first();

    if (!$user) {
      return ['success' => false, 'message' => 'User does not exist.'];
    }

    // Check existing invitation
    $existingInvitation = $project->invitedUsers()
      ->where('user_id', $user->id)
      ->first();

    // Handle rejected invitation
    if ($existingInvitation && $existingInvitation->pivot->status === 'rejected') {
      $project->invitedUsers()->updateExistingPivot($user->id, [
        'status' => 'pending',
        'role' => RolesEnum::ProjectMember->value,
        'updated_at' => now(),
      ]);

      broadcast(new ProjectInvitationRequestReceived($project, $user));
      return ['success' => true, 'message' => 'User re-invited successfully.'];
    }

    // Handle new invitation
    if (!$existingInvitation) {
      $project->invitedUsers()->attach($user->id, [
        'status' => 'pending',
        'role' => RolesEnum::ProjectMember->value,
        'created_at' => now(),
        'updated_at' => now()
      ]);

      broadcast(new ProjectInvitationRequestReceived($project, $user));
      return ['success' => true, 'message' => 'User invited successfully.'];
    }

    return ['success' => false, 'message' => 'This user has already been invited.'];
  }

  public function getPendingInvitations(User $user, array $filters = []) {
    $query = $user->projectInvitations()->wherePivot('status', 'pending');

    if (isset($filters['name'])) {
      $query->where('name', 'like', '%' . $filters['name'] . '%');
    }

    if (isset($filters['status'])) {
      $statuses = $filters['status'];
      if (is_array($statuses)) {
        $query->wherePivotIn('status', $statuses);
      } else {
        $query->wherePivot('status', $statuses);
      }
    }

    $sortField = $filters['sort_field'] ?? 'created_at';
    $sortDirection = $filters['sort_direction'] ?? 'desc';
    $perPage = $filters['per_page'] ?? 10;

    return $query->orderBy($sortField, $sortDirection)
      ->paginate($perPage)
      ->withQueryString();
  }

  public function updateInvitationStatus(Project $project, User $user, string $status) {
    $project->invitedUsers()->updateExistingPivot($user->id, ['status' => $status]);
    return true;
  }

  public function leaveProject(Project $project, User $user) {
    if ($user->id === $project->created_by) {
      return ['success' => false, 'message' => 'Project creators cannot leave their own projects. Please delete the project instead.'];
    }

    // Update all tasks assigned to this user in this project to have no assignee
    $project->tasks()
      ->where('assigned_user_id', $user->id)
      ->update([
        'assigned_user_id' => null,
        'updated_by' => $user->id,
        'updated_at' => now()
      ]);

    // Remove user from project
    $project->invitedUsers()->detach($user->id);

    return ['success' => true, 'message' => 'You have left the project.'];
  }

  public function kickMembers(Project $project, array $userIds) {
    // Update all tasks assigned to these users in this project to have no assignee
    $project->tasks()
      ->whereIn('assigned_user_id', $userIds)
      ->update([
        'assigned_user_id' => null,
        'updated_by' => Auth::id(),
        'updated_at' => now()
      ]);

    // Remove users from project
    $project->invitedUsers()->detach($userIds);

    return ['success' => true, 'message' => 'Selected members have been removed from the project.'];
  }
}

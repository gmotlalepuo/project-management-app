<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Enum\RolesEnum;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Events\ProjectInvitationRequestReceived;
use App\Notifications\ProjectInvitationNotification;
use Illuminate\Support\Facades\Cache;

class ProjectService extends BaseService {
  use FilterableTrait, SortableTrait;

  protected $taskService;

  public function __construct(TaskService $taskService) {
    $this->taskService = $taskService;
  }

  public function getProjectOptions($project) {
    return [
      'labelOptions' => $this->taskService->getLabelOptions($project),
      'statusOptions' => $this->taskService->getStatusOptions($project, false),
    ];
  }

  public function getProjects($user, array $filters) {
    $query = Project::visibleToUser($user->id)
      ->with(['tasks' => function ($query) {
        $query->latest()->limit(5)->with('labels');
      }])
      ->withCount([
        'tasks as total_tasks',
        'tasks as completed_tasks' => function ($query) {
          $query->where('status', 'completed');
        }
      ]);

    // Apply filters using trait methods
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'project'); // Specify type as 'project'
    }
    if (isset($filters['created_at'])) {
      $this->applyDateRangeFilter($query, $filters['created_at'], 'created_at');
    }

    return $this->paginateAndSort($query, $filters, 'projects');
  }

  public function storeProject($data) {
    $data['created_by'] = Auth::id();
    $data['updated_by'] = Auth::id();
    $data['due_date'] = $this->formatDate($data['due_date'] ?? null);

    if (isset($data['image'])) {
      $data['image_path'] = $this->handleImageUpload($data['image'], 'project');
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

  public function getProjectWithTasks(Project $project, array $filters) {
    $query = $project->tasks()->with(['labels', 'project', 'assignedUser']);

    // Apply filters using trait methods with explicit column names
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name'], 'tasks.name');
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status'], 'task');
    }
    if (isset($filters['priority'])) {
      $this->applyPriorityFilter($query, $filters['priority']);
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'tasks.due_date');
    }

    return $this->paginateAndSort($query, $filters, 'tasks');
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

      // Send notification
      $user->notify(new ProjectInvitationNotification($project));

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

      // Clear the members cache when new user is invited
      Cache::forget("project_{$project->id}_members");

      // Send notification
      $user->notify(new ProjectInvitationNotification($project));

      broadcast(new ProjectInvitationRequestReceived($project, $user));
      return ['success' => true, 'message' => 'User invited successfully.'];
    }

    return ['success' => false, 'message' => 'This user has already been invited.'];
  }

  public function getPendingInvitations(User $user, array $filters = []) {
    // Initialize basic filters with defaults to prevent undefined array key errors
    $filters['sort_field'] = $filters['sort_field'] ?? 'created_at';
    $filters['sort_direction'] = $filters['sort_direction'] ?? 'desc';
    $filters['per_page'] = $filters['per_page'] ?? 10;

    $basicFilters = $this->getBasicFilters($filters);

    $query = $user->projectInvitations()
      ->wherePivot('status', 'pending')
      ->withPivot('created_at', 'updated_at', 'status');

    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }

    return $this->paginateAndSort($query, $filters, 'projects');
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

    // Clear the members cache
    Cache::forget("project_{$project->id}_members");

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

    // Clear the members cache when new user is invited
    Cache::forget("project_{$project->id}_members");

    return ['success' => true, 'message' => 'Selected members have been removed from the project.'];
  }

  public function updateUserRole(Project $project, int $userId, string $role) {
    $user = Auth::user();
    $targetUser = User::findOrFail($userId);

    // Get target user's current role
    $targetUserCurrentRole = $project->acceptedUsers()
      ->where('user_id', $targetUser->id)
      ->first()
      ->pivot
      ->role;

    // Check if user is trying to modify their own role
    if ($targetUser->id === $user->id) {
      return [
        'success' => false,
        'message' => 'You cannot modify your own role.'
      ];
    }

    // Check if the user being updated is not the project creator
    if ($targetUser->id === $project->created_by) {
      return [
        'success' => false,
        'message' => 'Cannot change role of the project creator.'
      ];
    }

    // Get the current user's role in the project
    $userRole = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->first()
      ->pivot
      ->role;

    // Check if user has permission to manage roles (is creator or project manager)
    $isCreator = $user->id === $project->created_by;
    $isProjectManager = $userRole === RolesEnum::ProjectManager->value;

    if (!$isCreator && !$isProjectManager) {
      return [
        'success' => false,
        'message' => 'You do not have permission to manage user roles.'
      ];
    }

    // Only project creator can demote project managers
    if (
      $role === RolesEnum::ProjectMember->value &&
      $targetUserCurrentRole === RolesEnum::ProjectManager->value &&
      !$isCreator
    ) {
      return [
        'success' => false,
        'message' => 'Only the project creator can demote project managers.'
      ];
    }

    // Update the role
    $project->invitedUsers()->updateExistingPivot($userId, [
      'role' => $role,
      'updated_at' => now()
    ]);

    // Clear the members cache when new user is invited
    Cache::forget("project_{$project->id}_members");

    // Generate appropriate success message
    $actionType = $role === RolesEnum::ProjectManager->value ? 'promoted to' : 'changed to';
    $roleName = $role === RolesEnum::ProjectManager->value ? 'Project Manager' : 'Project Member';

    return [
      'success' => true,
      'message' => "{$targetUser->name} has been {$actionType} {$roleName}."
    ];
  }
}

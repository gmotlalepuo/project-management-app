<?php

namespace App\Traits;

use App\Enum\RolesEnum;
use App\Models\Task;
use App\Models\User;

trait HasProjectRoles {
  public function canManage(User $user): bool {
    return $user->id === $this->created_by ||
      $this->acceptedUsers()
      ->where('user_id', $user->id)
      ->where('role', RolesEnum::ProjectManager->value)
      ->exists();
  }

  public function canManageTask(User $user): bool {
    return $this->canManage($user);
  }

  public function canEditTask(User $user, Task $task): bool {
    // Project managers can edit any task
    if ($this->canManageTask($user)) {
      return true;
    }

    // Project members can edit tasks assigned to them
    return $task->isAssignedTo($user);
  }

  public function canDeleteTask(User $user): bool {
    // Only project managers can delete tasks
    return $this->canManageTask($user);
  }

  public function isProjectMember(User $user): bool {
    return $this->acceptedUsers()
      ->where('user_id', $user->id)
      ->where('role', RolesEnum::ProjectMember->value)
      ->exists();
  }

  public function canInviteUsers(User $user): bool {
    return $this->canManage($user);
  }

  public function canEditProject(User $user): bool {
    return $this->canManage($user);
  }

  public function canManageBoard(User $user): bool {
    return $this->canManage($user);
  }

  public function canKickProjectManager(User $user): bool {
    return $user->id === $this->created_by;
  }

  public function canKickProjectMember(User $user): bool {
    return $this->canKickProjectManager($user) ||
      ($this->acceptedUsers()
        ->where('user_id', $user->id)
        ->where('role', RolesEnum::ProjectManager->value)
        ->exists() && $user->id !== $this->created_by);
  }

  public function getKickableUsers(User $currentUser): array {
    $users = $this->acceptedUsers;
    $kickableUsers = [];

    foreach ($users as $user) {
      if ($user->id === $currentUser->id) {
        continue;
      }

      if ($user->pivot->role === RolesEnum::ProjectMember->value) {
        if ($this->canKickProjectMember($currentUser)) {
          $kickableUsers[] = $user;
        }
      } elseif ($user->pivot->role === RolesEnum::ProjectManager->value) {
        if ($this->canKickProjectManager($currentUser)) {
          $kickableUsers[] = $user;
        }
      }
    }

    return $kickableUsers;
  }

  public function getUserProjectRole(User $user): ?string {
    $projectUser = $this->acceptedUsers()
      ->where('user_id', $user->id)
      ->first();

    return $projectUser?->pivot?->role;
  }
}

<?php

namespace App\Models\Traits;

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
    if ($this->canManageTask($user)) {
      return true;
    }

    return $task->assigned_user_id === $user->id;
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
}

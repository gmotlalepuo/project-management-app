<?php

namespace App\Policies;

use App\Enum\RolesEnum;
use App\Models\TaskComment;
use App\Models\User;

class TaskCommentPolicy {
  public function create(User $user): bool {
    return $user->hasPermissionTo('comment_on_tasks');
  }

  public function update(User $user, TaskComment $comment): bool {
    return $user->id === $comment->user_id;
  }

  public function delete(User $user, TaskComment $comment): bool {
    // Get the project associated with the comment's task
    $project = $comment->task->project;

    // Check if user is a project manager for this project
    $isProjectManager = $project->acceptedUsers()
      ->where('user_id', $user->id)
      ->where('project_user.role', RolesEnum::ProjectManager->value)
      ->exists();

    // Allow if user is project manager or if it's their own comment
    return $isProjectManager || $user->id === $comment->user_id;
  }
}

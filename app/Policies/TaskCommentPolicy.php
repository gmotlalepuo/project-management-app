<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TaskComment;

class TaskCommentPolicy {
  public function create(User $user): bool {
    return $user->hasPermissionTo('comment_on_tasks');
  }

  public function update(User $user, TaskComment $comment): bool {
    // Users can only edit their own comments
    return $user->id === $comment->user_id;
  }

  public function delete(User $user, TaskComment $comment): bool {
    // Project managers can delete any comment
    if ($user->hasPermissionTo('manage_comments')) {
      return true;
    }

    // Users can delete their own comments
    if ($user->hasPermissionTo('delete_comments')) {
      return $user->id === $comment->user_id;
    }

    return false;
  }
}

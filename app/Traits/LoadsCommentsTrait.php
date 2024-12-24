<?php

namespace App\Traits;

trait LoadsCommentsTrait {
  protected function getCommentsLoadingOptions() {
    return [
      'comments' => function ($query) {
        $query->whereNull('parent_id')
          ->whereNull('deleted_at')
          ->orderBy('created_at', 'desc')
          ->with(['user', 'replies.user']);
      },
      'comments.replies' => function ($query) {
        $query->whereNull('deleted_at')
          ->orderBy('created_at', 'asc')
          ->with(['user', 'replies.user']);
      }
    ];
  }
}

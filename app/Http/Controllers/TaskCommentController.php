<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskCommentController extends Controller {
  use AuthorizesRequests;

  public function store(Request $request, Task $task) {
    // Check if user can comment on tasks
    if (!$request->user()->can('comment_on_tasks')) {
      abort(403, 'You cannot comment on tasks.');
    }

    $validated = $request->validate([
      'content' => 'required|string',
      'parent_id' => 'nullable|exists:task_comments,id'
    ]);

    $comment = $task->comments()->create([
      'content' => $validated['content'],
      'user_id' => Auth::id(),
      'parent_id' => $validated['parent_id'] ?? null,
    ]);

    // Refresh task with all necessary relationships
    $task->refresh()->load([
      'comments' => function ($query) {
        $query->whereNull('parent_id'); // Only load parent comments
      },
      'comments.user',
      'comments.replies.user',
      'comments.replies.replies' // Load nested replies
    ]);

    return redirect()->route('task.show', $task->id);
  }

  public function update(Request $request, Task $task, TaskComment $comment) {
    $this->authorize('update', $comment);

    $validated = $request->validate([
      'content' => 'required|string'
    ]);

    $comment->update([
      'content' => $validated['content'],
      'is_edited' => true
    ]);

    // Refresh task with all necessary relationships
    $task->refresh()->load([
      'comments' => function ($query) {
        $query->whereNull('parent_id'); // Only load parent comments
      },
      'comments.user',
      'comments.replies.user',
      'comments.replies.replies' // Load nested replies
    ]);

    return redirect()->route('task.show', $task->id);
  }

  public function destroy(Task $task, TaskComment $comment) {
    $this->authorize('delete', $comment);

    // Soft delete the comment and its replies
    $comment->delete(); // This will trigger the cascade soft delete

    $task->refresh()->load([
      'comments' => function ($query) {
        $query->whereNull('deleted_at')  // Only load non-deleted comments
          ->whereNull('parent_id')
          ->orderBy('created_at', 'desc');
      },
      'comments.user',
      'comments.replies' => function ($query) {
        $query->whereNull('deleted_at')  // Only load non-deleted replies
          ->orderBy('created_at', 'asc');
      },
      'comments.replies.user'
    ]);

    return back()->with('success', 'Comment deleted successfully.');
  }
}

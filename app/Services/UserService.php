<?php

namespace App\Services;

use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

class UserService {
  public function deleteUser(User $user) {
    DB::transaction(function () use ($user) {
      // Get all projects where user is a member (but not creator)
      $memberProjects = $user->projectInvitations()
        ->where('project_user.status', 'accepted')
        ->whereNotIn('projects.id', function ($query) use ($user) {
          $query->select('id')
            ->from('projects')
            ->where('created_by', $user->id);
        })
        ->get();

      // Remove user from these projects
      foreach ($memberProjects as $project) {
        // Update tasks where user is assigned
        $project->tasks()
          ->where('assigned_user_id', $user->id)
          ->update(['assigned_user_id' => null]);

        // Remove user from project
        $project->invitedUsers()->detach($user->id);
      }

      // Update tasks created by this user across all projects
      Task::where('created_by', $user->id)
        ->update(['created_by' => null]);

      Task::where('updated_by', $user->id)
        ->update(['updated_by' => null]);

      // Delete the user (this will cascade delete their created projects)
      $user->delete();
    });
  }
}

<?php

namespace App\Models;

use App\Enum\RolesEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'due_date',
        'status',
        'created_by',
        'updated_by',
    ];

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedUser() {
        return $this->belongsTo(User::class, 'assigned_user_id')->withDefault();
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Relation for invited users
    public function invitedUsers() {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->withPivot('status', 'role')
            ->withTimestamps();
    }

    // Relation for accepted users
    public function acceptedUsers() {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->wherePivot('status', 'accepted')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function scopeVisibleToUser($query, $userId) {
        return $query->whereHas('invitedUsers', function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->where('project_user.status', 'accepted')
                ->whereIn('project_user.role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value]);
        });
    }

    public function canManage(User $user): bool {
        return $user->id === $this->created_by ||
            $this->acceptedUsers()
            ->where('user_id', $user->id)
            ->where('role', RolesEnum::ProjectManager->value)
            ->exists();
    }

    public function canManageTask(User $user): bool {
        return $user->id === $this->created_by ||
            $this->acceptedUsers()
            ->where('user_id', $user->id)
            ->where('role', RolesEnum::ProjectManager->value)
            ->exists();
    }

    public function canEditTask(User $user, Task $task): bool {
        // Project managers can edit all tasks
        if ($this->canManageTask($user)) {
            return true;
        }

        // Project members can only edit tasks assigned to them
        return $task->assigned_user_id === $user->id;
    }

    public function isProjectMember(User $user): bool {
        return $this->acceptedUsers()
            ->where('user_id', $user->id)
            ->where('role', RolesEnum::ProjectMember->value)
            ->exists();
    }

    public function canInviteUsers(User $user): bool {
        return $user->id === $this->created_by ||
            $this->acceptedUsers()
            ->where('user_id', $user->id)
            ->where('role', RolesEnum::ProjectManager->value)
            ->exists();
    }

    public function canEditProject(User $user): bool {
        return $this->canInviteUsers($user); // Same permissions as inviting users
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
                continue; // Skip current user
            }

            if ($user->pivot->role === RolesEnum::ProjectMember->value) {
                // Project managers and creators can kick members
                if ($this->canKickProjectMember($currentUser)) {
                    $kickableUsers[] = $user;
                }
            } elseif ($user->pivot->role === RolesEnum::ProjectManager->value) {
                // Only project creator can kick other project managers
                if ($this->canKickProjectManager($currentUser)) {
                    $kickableUsers[] = $user;
                }
            }
        }

        return $kickableUsers;
    }
}

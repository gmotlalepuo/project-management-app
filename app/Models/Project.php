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
}

<?php

namespace App\Models;

use App\Enum\RolesEnum;
use App\Traits\HasProjectRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    use HasFactory, HasProjectRoles;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'due_date',
        'status',
        'created_by',
        'updated_by',
    ];

    // Relationships
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

    public function invitedUsers() {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->withPivot('status', 'role')
            ->withTimestamps();
    }

    public function acceptedUsers() {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->wherePivot('status', 'accepted')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function taskLabels() {
        return $this->hasMany(TaskLabel::class);
    }

    public function kanbanColumns() {
        return $this->hasMany(KanbanColumn::class);
    }

    // Scopes
    public function scopeVisibleToUser($query, $userId) {
        return $query->whereHas('invitedUsers', function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->where('project_user.status', 'accepted')
                ->whereIn('project_user.role', [RolesEnum::ProjectManager->value, RolesEnum::ProjectMember->value]);
        });
    }
}

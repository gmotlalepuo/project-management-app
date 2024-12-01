<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Task extends Model {
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'due_date',
        'status',
        'priority',
        'project_id',
        'assigned_user_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'assigned_user_id' => 'integer', // Add this to properly handle null values
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function assignedUser() {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeVisibleToUser($query, $userId) {
        return $query->whereHas('project', function ($query) use ($userId) {
            $query->visibleToUser($userId);
        });
    }

    public function labels(): BelongsToMany {
        return $this->belongsToMany(TaskLabel::class, 'label_task', 'task_id', 'task_label_id');
    }
}

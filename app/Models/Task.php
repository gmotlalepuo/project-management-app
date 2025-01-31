<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'task_number',
        'kanban_column_id',
    ];

    protected $casts = [
        'assigned_user_id' => 'integer', // Add this to properly handle null values
    ];

    protected $with = ['labels', 'assignedUser', 'project']; // Add default eager loading

    protected static function boot() {
        parent::boot();

        static::creating(function ($task) {
            // Get the last task number for this project
            $lastTask = static::where('project_id', $task->project_id)
                ->orderBy('task_number', 'desc')
                ->first();

            // Set the task number as the next number for this project
            $task->task_number = $lastTask ? $lastTask->task_number + 1 : 1;

            // Assign to appropriate kanban column based on status
            if (!$task->kanban_column_id) {
                $defaultColumn = KanbanColumn::where('project_id', $task->project_id)
                    ->where('maps_to_status', $task->status)
                    ->first();

                if ($defaultColumn) {
                    $task->kanban_column_id = $defaultColumn->id;
                }
            }
        });

        // When a task's status changes, update its kanban column
        static::updating(function ($task) {
            if ($task->isDirty('status')) {
                $mappedColumn = KanbanColumn::where('project_id', $task->project_id)
                    ->where('maps_to_status', $task->status)
                    ->first();

                if ($mappedColumn) {
                    $task->kanban_column_id = $mappedColumn->id;
                }
            }
        });
    }

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

    public function canBeAssignedBy(User $user): bool {
        return $this->assigned_user_id === null &&
            $this->project->acceptedUsers()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function isAssignedTo(User $user): bool {
        return $this->assigned_user_id === $user->id;
    }

    public function canBeUnassignedBy(User $user): bool {
        return $this->isAssignedTo($user);
    }

    public function comments(): HasMany {
        return $this->hasMany(TaskComment::class)->whereNull('parent_id');
    }

    public function allComments(): HasMany {
        return $this->hasMany(TaskComment::class);
    }

    public function kanbanColumn() {
        return $this->belongsTo(KanbanColumn::class);
    }
}

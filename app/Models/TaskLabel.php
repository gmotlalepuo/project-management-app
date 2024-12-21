<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskLabel extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'variant',
        'project_id',
        'created_by',
        'updated_by'
    ];


    public function tasks(): BelongsToMany {
        return $this->belongsToMany(Task::class, 'label_task', 'task_id', 'task_label_id');
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

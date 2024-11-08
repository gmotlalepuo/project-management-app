<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TaskLabel extends Model {
    protected $fillable = ['name', 'variant', 'project_id'];

    public function tasks(): BelongsToMany {
        return $this->belongsToMany(Task::class, 'label_task', 'task_id', 'task_label_id');
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }
}

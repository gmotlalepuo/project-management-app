<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskStatus extends Model {
  protected $fillable = [
    'name',
    'slug',
    'color',
    'is_default',
    'project_id',
    'created_by',
    'updated_by',
  ];

  protected $casts = [
    'is_default' => 'boolean',
  ];

  public function project(): BelongsTo {
    return $this->belongsTo(Project::class);
  }

  public function tasks(): HasMany {
    return $this->hasMany(Task::class, 'status_id');
  }

  public function createdBy(): BelongsTo {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function updatedBy(): BelongsTo {
    return $this->belongsTo(User::class, 'updated_by');
  }

  public function statusHistory(): BelongsToMany {
    return $this->belongsToMany(Task::class, 'task_status_history')
      ->withTimestamps();
  }

  public function kanbanColumns(): HasMany {
    return $this->hasMany(KanbanColumn::class);
  }
}

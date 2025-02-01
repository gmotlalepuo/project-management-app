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
    'project_id'
  ];

  protected $casts = [
    'is_default' => 'boolean',
  ];

  public function project(): BelongsTo {
    return $this->belongsTo(Project::class);
  }

  public function tasks(): BelongsToMany {
    return $this->belongsToMany(Task::class, 'status_task');
  }

  public function kanbanColumns(): HasMany {
    return $this->hasMany(KanbanColumn::class);
  }
}

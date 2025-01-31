<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KanbanColumn extends Model {
  protected $fillable = [
    'name',
    'order',
    'project_id',
    'is_default',
    'maps_to_status',
    'color',
  ];

  protected $casts = [
    'is_default' => 'boolean',
    'order' => 'integer',
  ];

  public function project(): BelongsTo {
    return $this->belongsTo(Project::class);
  }

  public function tasks(): HasMany {
    return $this->hasMany(Task::class, 'kanban_column_id');
  }
}

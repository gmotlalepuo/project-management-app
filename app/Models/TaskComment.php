<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskComment extends Model {
  use SoftDeletes;

  protected $fillable = [
    'task_id',
    'user_id',
    'content',
    'parent_id',
    'is_edited',
  ];

  protected $casts = [
    'is_edited' => 'boolean',
  ];

  protected static function boot() {
    parent::boot();

    // Cascade soft delete for replies
    static::deleting(function ($comment) {
      $comment->replies->each(function ($reply) {
        $reply->delete(); // This will trigger soft delete
      });
    });
  }

  // Add scope to exclude deleted comments
  public function scopeActive($query) {
    return $query->whereNull('deleted_at');
  }

  public function task(): BelongsTo {
    return $this->belongsTo(Task::class);
  }

  public function user(): BelongsTo {
    return $this->belongsTo(User::class);
  }

  public function parent(): BelongsTo {
    return $this->belongsTo(TaskComment::class, 'parent_id');
  }

  public function replies(): HasMany {
    return $this->hasMany(TaskComment::class, 'parent_id');
  }
}

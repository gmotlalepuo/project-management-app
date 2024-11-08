<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TaskLabel extends Model {
    protected $fillable = ['name', 'bg_color_class', 'border_color_class', 'text_color_class'];

    public function tasks(): BelongsToMany {
        return $this->belongsToMany(Task::class);
    }
}

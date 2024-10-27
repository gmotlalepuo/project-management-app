<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'due_date',
        'status',
        'created_by',
        'updated_by',
    ];

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Relation for invited users
    public function invitedUsers() {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->withPivot('status')  // Ensure the status field is loaded
            ->withTimestamps();  // Ensure timestamps are handled
    }
}

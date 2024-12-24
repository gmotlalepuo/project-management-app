<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/tasks/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
Route::get('/projects/{project}/users', [TaskController::class, 'getUsers'])->name('task.users');

Route::resource('task', TaskController::class);
Route::post('/task/{task}/assign-to-me', [TaskController::class, 'assignToMe'])->name('task.assignToMe');
Route::post('/task/{task}/unassign', [TaskController::class, 'unassign'])->name('task.unassign');

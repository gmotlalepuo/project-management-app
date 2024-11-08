<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskLabelController;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Project routes
    Route::post('/project/{project}/invite', [ProjectController::class, 'inviteUser'])->name('project.invite');
    Route::get('/project/invitations', [ProjectController::class, 'showInvitations'])->name('project.invitations');  // Show user invitations
    Route::post('/project/{project}/accept-invitation', [ProjectController::class, 'acceptInvitation'])->name('project.acceptInvitation');
    Route::post('/project/{project}/reject-invitation', [ProjectController::class, 'rejectInvitation'])->name('project.rejectInvitation');
    Route::get('/project/{project}/search-users', [UserController::class, 'search'])->name('user.search');

    // The resource route for project management
    Route::resource('project', ProjectController::class);

    // Task routes
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
    Route::resource('task', TaskController::class);

    // Task label routes
    Route::resource('task_labels', TaskLabelController::class);

    // User routes
    Route::resource('user', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

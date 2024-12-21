<?php

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskLabelController;

Route::redirect('/', '/dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project invitation routes
    Route::middleware('verified')->group(function () {
        Route::get('/project/invitations', [ProjectController::class, 'showInvitations'])->name('project.invitations');
        Route::post('/project/{project}/accept-invitation', [ProjectController::class, 'acceptInvitation'])->name('project.acceptInvitation');
        Route::post('/project/{project}/reject-invitation', [ProjectController::class, 'rejectInvitation'])->name('project.rejectInvitation');
    });

    // Admin routes
    Route::middleware(['verified', 'role:' . RolesEnum::Admin->value])->group(function () {
        Route::resource('user', UserController::class);
    });

    // Project and Task routes
    Route::middleware('verified')->group(function () {
        // Basic project routes - available to all authenticated users
        Route::get('/project', [ProjectController::class, 'index'])->name('project.index');
        Route::get('/project/create', [ProjectController::class, 'create'])->name('project.create');
        Route::post('/project', [ProjectController::class, 'store'])->name('project.store');
        Route::get('/project/{project}', [ProjectController::class, 'show'])->name('project.show');

        // Project management routes - require specific permissions
        Route::post('/project/{project}/leave', [ProjectController::class, 'leaveProject'])
            ->name('project.leave');

        Route::get('/project/{project}/edit', [ProjectController::class, 'edit'])
            ->name('project.edit')
            ->middleware('permission:' . PermissionsEnum::ManageProjects->value);
        Route::put('/project/{project}', [ProjectController::class, 'update'])
            ->name('project.update')
            ->middleware('permission:' . PermissionsEnum::ManageProjects->value);
        Route::delete('/project/{project}', [ProjectController::class, 'destroy'])
            ->name('project.destroy')
            ->middleware('permission:' . PermissionsEnum::ManageProjects->value);
        Route::get('/project/{project}/search-users', [UserController::class, 'search'])->name('user.search')->middleware('permission:' . PermissionsEnum::ManageProjects->value);
        Route::post('/project/{project}/invite', [ProjectController::class, 'inviteUser'])
            ->name('project.invite')
            ->middleware('permission:' . PermissionsEnum::ManageProjects->value);

        // Add this inside your routes group
        Route::get('/project/{project}/check-role', [ProjectController::class, 'checkRole'])
            ->name('project.check-role');

        Route::post('/project/{project}/kick-members', [ProjectController::class, 'kickMembers'])
            ->name('project.kick-members')
            ->middleware('permission:' . PermissionsEnum::ManageProjects->value);

        // Task routes - available to project members
        Route::get('/tasks/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
        Route::resource('task', TaskController::class);
        Route::post('/task/{task}/assign-to-me', [TaskController::class, 'assignToMe'])->name('task.assignToMe');
        Route::post('/task/{task}/unassign', [TaskController::class, 'unassign'])->name('task.unassign');

        // Task label routes
        Route::get('/task_labels/search', [TaskLabelController::class, 'search'])->name('task_labels.search');

        // New route
        Route::get('/projects/{project}/users', [TaskController::class, 'getUsers'])->name('task.users');

        // Project label routes - modify these lines
        Route::get('/projects/{project}/labels', [TaskLabelController::class, 'index'])
            ->name('project.labels.index');
        Route::get('/projects/{project}/labels/create', [TaskLabelController::class, 'create'])
            ->name('project.labels.create');
        Route::post('/projects/{project}/labels', [TaskLabelController::class, 'store'])
            ->name('project.labels.store');
        Route::get('/projects/{project}/labels/{label}/edit', [TaskLabelController::class, 'edit'])
            ->name('project.labels.edit');
        Route::put('/projects/{project}/labels/{label}', [TaskLabelController::class, 'update'])
            ->name('project.labels.update');
        Route::delete('/projects/{project}/labels/{label}', [TaskLabelController::class, 'destroy'])
            ->name('project.labels.destroy');
    });
});

require __DIR__ . '/auth.php';

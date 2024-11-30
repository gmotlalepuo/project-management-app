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
        Route::get('/project/{project}/search-users', [UserController::class, 'search'])->name('user.search');
    });

    // Admin routes
    Route::middleware(['verified', 'role:' . RolesEnum::Admin->value])->group(function () {
        Route::resource('user', UserController::class);
    });

    // Project manager and project member routes
    Route::middleware([
        'verified',
        sprintf(
            'role:%s|%s|%s',
            RolesEnum::Admin->value,
            RolesEnum::ProjectManager->value,
            RolesEnum::ProjectMember->value
        )
    ])->group(function () {
        // Project routes
        Route::post('/project/{project}/invite', [ProjectController::class, 'inviteUser'])->name('project.invite');
        Route::post('/project/{project}/leave', [ProjectController::class, 'leaveProject'])->name('project.leave');

        Route::resource('project', ProjectController::class)
            ->middleware('can:' . PermissionsEnum::ManageProjects->value);

        // Task routes
        Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
        Route::resource('task', TaskController::class);

        // Task label routes
        Route::get('/task_labels/search', [TaskLabelController::class, 'search'])->name('task_labels.search');
        Route::resource('task_labels', TaskLabelController::class);
    });
});

require __DIR__ . '/auth.php';

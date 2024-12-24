<?php

use App\Enum\PermissionsEnum;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Basic project routes
Route::get('/project', [ProjectController::class, 'index'])->name('project.index');
Route::get('/project/create', [ProjectController::class, 'create'])->name('project.create');
Route::post('/project', [ProjectController::class, 'store'])->name('project.store');
Route::get('/project/{project}', [ProjectController::class, 'show'])->name('project.show');
Route::post('/project/{project}/leave', [ProjectController::class, 'leaveProject'])->name('project.leave');
Route::get('/project/{project}/check-role', [ProjectController::class, 'checkRole'])->name('project.check-role');
Route::put('/project/{project}/update-user-role', [ProjectController::class, 'updateUserRole'])->name('project.update-user-role');

// Project management routes
Route::middleware('permission:' . PermissionsEnum::ManageProjects->value)->group(function () {
  Route::get('/project/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
  Route::put('/project/{project}', [ProjectController::class, 'update'])->name('project.update');
  Route::delete('/project/{project}', [ProjectController::class, 'destroy'])->name('project.destroy');
  Route::get('/project/{project}/search-users', [UserController::class, 'search'])->name('user.search');
  Route::post('/project/{project}/invite', [ProjectController::class, 'inviteUser'])->name('project.invite');
  Route::post('/project/{project}/kick-members', [ProjectController::class, 'kickMembers'])->name('project.kick-members');
});

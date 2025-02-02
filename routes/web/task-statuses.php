<?php

use App\Enum\PermissionsEnum;
use App\Http\Controllers\TaskStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware('permission:' . PermissionsEnum::ManageProjects->value)->group(function () {
  Route::get('/project/{project}/statuses', [TaskStatusController::class, 'index'])
    ->name('project.statuses.index');

  Route::get('/project/{project}/statuses/create', [TaskStatusController::class, 'create'])
    ->name('project.statuses.create');

  Route::post('/project/{project}/statuses', [TaskStatusController::class, 'store'])
    ->name('project.statuses.store');

  Route::get('/project/{project}/statuses/{status}/edit', [TaskStatusController::class, 'edit'])
    ->name('project.statuses.edit');

  Route::put('/project/{project}/statuses/{status}', [TaskStatusController::class, 'update'])
    ->name('project.statuses.update');

  Route::delete('/project/{project}/statuses/{status}', [TaskStatusController::class, 'destroy'])
    ->name('project.statuses.destroy');
});

<?php

use App\Enum\PermissionsEnum;
use App\Http\Controllers\TaskLabelController;
use Illuminate\Support\Facades\Route;

Route::get('/task_labels/search', [TaskLabelController::class, 'search'])->name('task_labels.search');

Route::middleware('permission:' . PermissionsEnum::ManageProjects->value)->group(function () {
  Route::get('/projects/{project}/labels', [TaskLabelController::class, 'index'])->name('project.labels.index');
  Route::get('/projects/{project}/labels/create', [TaskLabelController::class, 'create'])->name('project.labels.create');
  Route::post('/projects/{project}/labels', [TaskLabelController::class, 'store'])->name('project.labels.store');
  Route::get('/projects/{project}/labels/{label}/edit', [TaskLabelController::class, 'edit'])->name('project.labels.edit');
  Route::put('/projects/{project}/labels/{label}', [TaskLabelController::class, 'update'])->name('project.labels.update');
  Route::delete('/projects/{project}/labels/{label}', [TaskLabelController::class, 'destroy'])->name('project.labels.destroy');
});

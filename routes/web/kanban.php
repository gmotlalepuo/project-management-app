<?php

use App\Http\Controllers\KanbanController;
use Illuminate\Support\Facades\Route;

Route::get('/projects/{project}/kanban', [KanbanController::class, 'show'])
  ->name('kanban.show');

Route::post('/kanban/tasks/{task}/move', [KanbanController::class, 'moveTask'])
  ->name('kanban.move-task');

Route::post('/projects/{project}/kanban/columns/order', [KanbanController::class, 'updateColumnOrder'])
  ->name('kanban.update-column-order');

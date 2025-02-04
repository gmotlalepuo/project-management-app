<?php

use App\Http\Controllers\KanbanController;
use Illuminate\Support\Facades\Route;

Route::get('/project/{project}/kanban', [KanbanController::class, 'show'])->name('kanban.show');
Route::post('/task/{task}/move', [KanbanController::class, 'moveTask'])->name('kanban.move-task');
Route::post('/project/{project}/kanban/columns/order', [KanbanController::class, 'updateColumnsOrder'])->name('kanban.update-columns-order');

<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/project/invitations', [ProjectController::class, 'showInvitations'])->name('project.invitations');
Route::post('/project/{project}/accept-invitation', [ProjectController::class, 'acceptInvitation'])->name('project.acceptInvitation');
Route::post('/project/{project}/reject-invitation', [ProjectController::class, 'rejectInvitation'])->name('project.rejectInvitation');

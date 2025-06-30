<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssetsController;
use App\Http\Controllers\ConfiscationController;
use App\Http\Controllers\PreConfiscationController;
use App\Http\Controllers\ValuationController;
use App\Http\Controllers\DisposalController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TrustFundController;
use App\Http\Controllers\DocumentController;

Route::apiResource('assets', AssetsController::class);
Route::apiResource('confiscations', ConfiscationController::class);
Route::apiResource('pre-confiscations', PreConfiscationController::class);
Route::apiResource('valuations', ValuationController::class);
Route::apiResource('disposals', DisposalController::class);
Route::apiResource('reports', ReportController::class);
Route::apiResource('trust-funds', TrustFundController::class);
Route::get('get-by-status', [AssetsController::class, 'getByStatus']);

Route::post('/documents', [DocumentController::class, 'store']);
Route::get('/get-list', [DocumentController::class, 'getList']);
Route::get('/documents/{id}', [DocumentController::class, 'show']);
Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);



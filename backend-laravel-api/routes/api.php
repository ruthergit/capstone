<?php

use App\Http\Controllers\AuthController;    
use App\Http\Controllers\API\ScholarshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/scholarships', [ScholarshipController::class, 'index']);
    Route::post('/scholarships', [ScholarshipController::class, 'store']); // optional for admin
    Route::post('/scholarships/{id}/apply', [ScholarshipController::class, 'apply']);
});
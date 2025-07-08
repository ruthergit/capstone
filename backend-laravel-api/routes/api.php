<?php

use App\Http\Controllers\AuthController;    
use App\Http\Controllers\API\ScholarshipController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->post('/users/multiple', [UserController::class, 'getMultiple']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/scholarships', [ScholarshipController::class, 'index']);
    Route::post('/scholarships', [ScholarshipController::class, 'store']); // optional for admin
    Route::post('/scholarships/{id}/apply', [ScholarshipController::class, 'apply']);
    Route::get('/scholarships/{id}/applicants', [ScholarshipController::class, 'getApplicants']);
    Route::get('/applicants', [ScholarshipController::class, 'allApplicants']); 
});
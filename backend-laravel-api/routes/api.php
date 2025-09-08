<?php

use App\Http\Controllers\AuthController;    
use App\Http\Controllers\API\ScholarshipController;
use App\Http\Controllers\API\AssistantshipController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {

    // User routes...
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/users/multiple', [UserController::class, 'getMultiple']);

    // Scholarship routes...
    Route::get('/scholarships', [ScholarshipController::class, 'index']);
    Route::post('/scholarships', [ScholarshipController::class, 'store']);
    Route::post('/scholarship-applicants/{id}/approve', [ScholarshipController::class, 'approve']);
    Route::post('/scholarships/{id}/reject', [ScholarshipController::class, 'reject']); 
    Route::post('/scholarships/{id}/apply', [ScholarshipController::class, 'apply']);
    Route::get('/scholarships/{id}/scholarship-applications', [ScholarshipController::class, 'getApplicant']);
    Route::get('/scholarships/{id}/applicants', [ScholarshipController::class, 'scholarshipApplicants']);
    Route::get('/applicants', [ScholarshipController::class, 'allApplicants']);

    // Assistantship routes...
    Route::get('/assistantships', [AssistantshipController::class, 'index']);
    Route::post('/assistantships', [AssistantshipController::class, 'store']);
    Route::post('/assistantship-applicants/{id}/approve', [AssistantshipController::class, 'approve']);
    Route::post('/assistantships/{id}/reject', [AssistantshipController::class, 'reject']);
    Route::post('/assistantships/{id}/apply', [AssistantshipController::class, 'apply']);
    Route::get('/assistantships/{id}/assistantship-applications', [AssistantshipController::class, 'getApplicant']);
    Route::get('/assistantships/{id}/applicants', [AssistantshipController::class, 'assistantshipApplicants']);
    Route::get('/assistantship-applicants', [AssistantshipController::class, 'allApplicants']);

    // Scholarship and assistantship applicants notification routes
    Route::get('/user/{id}/notifications', [NotificationController::class, 'index']);
    Route::post('/user/{id}/notifications/{notificationId}/read', [NotificationController::class, 'markAsRead']);

    // Event creation & viewing
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // Event approval
    Route::prefix('events/{event}')->group(function () {
        // Approve routes
        Route::post('/advisor', [EventController::class, 'approveByOrgAdvisor']);
        Route::post('/dean', [EventController::class, 'approveByDean']);
        Route::post('/admin', [EventController::class, 'approveByAdmin']);

        // Reject routes
        Route::post('/reject/advisor', [EventController::class, 'rejectedByOrgAdvisor']);
        Route::post('/reject/dean', [EventController::class, 'rejectedByDean']);
        Route::post('/reject/admin', [EventController::class, 'rejectedByAdmin']);

        // Revision request
        Route::post('/revision/advisor', [EventController::class, 'requestRevisionByOrgAdvisor']);
        Route::post('/revision/dean', [EventController::class, 'requestRevisionByDean']);
        Route::post('/revision/admin', [EventController::class, 'requestRevisionByAdmin']);

        // Revision routes
         Route::put('/', [EventController::class, 'update']); // event revision submission

    });
});



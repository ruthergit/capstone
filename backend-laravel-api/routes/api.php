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

    Route::get('/events', [EventController::class, 'index']);   // for listing
    Route::post('/events', [EventController::class, 'store']);  // for creating
    Route::put('/events/{id}', [EventController::class, 'update']);
    
    // For student_org: list only fully approved events
    Route::get('/events/approved', [EventController::class, 'approvedEvents']);
    // Approve / Reject / Revision
    Route::post('/events/{id}/approve', [EventController::class, 'approve']);
    // List events created by a student org
    Route::get('/events/my', [EventController::class, 'myEvents']);
    // List pending approvals for the logged-in user
    Route::get('/approvals/pending', [EventController::class, 'myPendingApprovals']);
    // (Optional) View full event details with approvals
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events/{id}/final-date', [EventController::class, 'setFinalDate']);
    
});



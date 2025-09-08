<?php

use Illuminate\Support\Facades\Route;

Route::get('/preview-pdf/{type}/{filename}', function ($type, $filename) {
    $allowedTypes = ['scholarships', 'assistantships', 'applications']; 
    
    if (!in_array($type, $allowedTypes)) {
        abort(404, 'Invalid file type.');
    }

    $path = storage_path("app/public/{$type}/{$filename}");

    if (!file_exists($path)) {
        abort(404, 'File not found.');
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $filename . '"'
    ]);
});

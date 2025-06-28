<?php

use Illuminate\Support\Facades\Route;

Route::get('/preview-pdf/{filename}', function ($filename) {
    $path = storage_path('app/public/scholarships/' . $filename);

    if (!file_exists($path)) {
        abort(404, 'File not found.');
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $filename . '"'
    ]);
});
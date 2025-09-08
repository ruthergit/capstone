<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class NotificationController extends Controller
{
    /**
     * Get all notifications for a user
     */
    public function index($userId)
    {
        $user = User::findOrFail($userId);

        $notifications = $user->notifications()
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark a notification as read for a user
     */
    public function markAsRead($userId, $notificationId)
    {
        $user = User::findOrFail($userId);

        $notification = $user->notifications()->where('id', $notificationId)->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read']);
        }

        return response()->json(['error' => 'Notification not found'], 404);
    }
}

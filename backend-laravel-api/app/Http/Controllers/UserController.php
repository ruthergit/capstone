<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Models\User;
class UserController extends Controller
{
    public function show($login_id)
    {
        $user = User::where('login_id', $login_id)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function getMultiple(Request $request)
    {
        $request->validate([
            'login_ids' => 'required|array',
            'login_ids.*' => 'exists:users,login_id',
        ]);

        $users = User::whereIn('login_id', $request->login_ids)->get();

    return response()->json($users);
    }
}

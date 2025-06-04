<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // === Register ===
    public function register(Request $request)
    {
       $request->validate([
            'name' => 'required|string',
            'login_id' => 'required|string|unique:users',
            'password' => 'required|string|confirmed',
            'type' => 'required|in:admin,student,student_org,faculty,org_advisor,dean',
        ]);

       $user = User::create([
            'name' => $request->name,
            'login_id' => $request->login_id,
            'password' => $request->password,
            'type' => $request->type,
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // === Login ===
        public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('login_id', $request->login_id)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login_id' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token (Laravel Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // Create response with user data (without token in body)
        $response = response()->json([
            'message' => 'Logged in',
            'user' => $user,
        ]);

        // Attach HttpOnly cookie with the token
        $cookie = cookie(
            'token',                // cookie name
            $token,                 // cookie value
            60 * 24,                // expiration time in minutes (1 day)
            '/',                    // path
            null,                   // domain
            true,                   // secure — set to true in production (HTTPS)
            true,                   // httpOnly
            false,                  // raw
            'Strict'                // SameSite policy
        );

        return $response->withCookie($cookie);
    }

    // === Logout ===
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out',
        ]);
    }
}

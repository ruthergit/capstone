<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\ScholarshipModel\ScholarshipApplicant;
use App\Models\AssistantshipModel\AssistantshipApplicant;

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

            // Required only if student_org
            // New validation rules
            'org_advisor_id' => 'nullable|exists:users,id',
            'dean_id' => 'required_if:type,student_org,org_advisor|exists:users,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'login_id' => $request->login_id,
            'password' => bcrypt($request->password),
            'type' => $request->type,
            'org_advisor_id' => $request->org_advisor_id ?? null,
            'dean_id' => $request->dean_id ?? null,
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

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login_id' => ['The provided credentials are incorrect.'],
            ]);
        }

        $applicantId = null;

        $scholarshipApplicant = ScholarshipApplicant::where('user_id', $user->id)->first();
        if ($scholarshipApplicant) {
            $applicantId = $scholarshipApplicant->id;
        }

        $assistantshipApplicant = AssistantshipApplicant::where('user_id', $user->id)->first();
        if ($assistantshipApplicant) {
            $applicantId = $assistantshipApplicant->id;
        }

        // Attach applicant_id dynamically
        $user->applicant_id = $applicantId;

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in',
            'user' => $user,
            'token' => $token,
        ]);
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

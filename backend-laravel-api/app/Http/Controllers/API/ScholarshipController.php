<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ScholarshipModel\Scholarship;
use App\Models\ScholarshipModel\ScholarshipApplicant;

class ScholarshipController extends Controller
{
    // Store new scholarship (admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'pdf' => 'required|file|mimes:pdf|max:2048',
        ]);
        
        $file = $request->file('pdf');
        $originalName = $file->getClientOriginalName(); 
        $path = $request->file('pdf')->store('scholarships', 'public');

        $scholarship = Scholarship::create([
            'name' => $request->name,
            'pdf_path' => $path,
            'original_name' => $originalName,
        ]);

        return response()->json($scholarship, 201);
    }

    public function approve(Request $request, $id)
    {
        try {
            $applicant = ScholarshipApplicant::findOrFail($id); // ✅ updated model

            $applicant->update([
                'status' => 'approved'
            ]);

            return response()->json(['message' => 'Student scholarship approved']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], status: 500);
        }
    }

    // Get all scholarships
    public function index()
    {
        return Scholarship::all();
    }

    // Apply to scholarship (student only)
    public function apply(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->type !== 'student') {
            return response()->json(['message' => 'Only students can apply'], 403);
        }

        $request->validate([
            'pdf' => 'required|file|mimes:pdf|max:2048',
        ]);

        $scholarship = Scholarship::findOrFail($id);

        $file = $request->file('pdf');
        $originalName = $file->getClientOriginalName(); 
        $path = $file->store('applications', 'public');

        $application = ScholarshipApplicant::updateOrCreate( // ✅ updated model
            [
                'user_id' => $user->id, 
                'scholarship_id' => $id
            ],
            [
                'submitted_at' => now(),
                'pdf_path' => $path,
                'original_name' => $originalName,
                'user_name' => $user->name,
                'user_email' => $user->email,
            ]
        );

        return response()->json([
            'message' => 'Applied successfully',
            'application' => $application,
        ]);
    }

    public function getApplicant($userId)
    {
        $applications = ScholarshipApplicant::with('scholarship')
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            'user_id' => $userId,
            'applications' => $applications,
        ]);
    }


    public function allApplicants()
    {
        $applicants = ScholarshipApplicant::with(['user', 'scholarship'])->get(); // ✅ updated model

        return response()->json($applicants);
    }
}

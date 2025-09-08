<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Notifications\ScholarshipApproved;
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
        $path = $file->store('scholarships', 'public'); // ✅ same as apply()

        $scholarship = Scholarship::create([
            'name' => $request->name,
            'pdf_path' => $path,
            'original_name' => $originalName,
        ]);

        return response()->json([
            'message' => 'Scholarship created successfully',
            'scholarship' => $scholarship,
            'preview_url' => url("storage/" . $path), 
        ], 201);
    }


    public function approve($id)
    {
        try {
            $applicant = ScholarshipApplicant::findOrFail($id);

            $applicant->update([
                'status' => 'approved'
            ]);

            $scholarshipName = $applicant->scholarship->name ?? 'Scholarship';

            $applicant->user->notify(new ScholarshipApproved($scholarshipName));

            return response()->json([
                'message' => 'Scholarship approved and user notified.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function reject($id)
    {
        try {
            $applicant = ScholarshipApplicant::findOrFail($id);

            $applicant->update([
                'status'=> 'rejected'
            ]);

            return response()->json(['message' => 'Student scholarship rejected']);
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
            'preview_url' => url("storage/" . $path), // 👈 important
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
        $applicants = ScholarshipApplicant::with(['user', 'scholarship'])->get();

        $applicants->transform(function ($applicant) {
            $applicant->pdf_url = url("storage/" . $applicant->pdf_path);
            return $applicant;
        });

        return response()->json($applicants);
    }
    // Get all applicants for a specific scholarship
    public function scholarshipApplicants($scholarshipId)
    {
        $scholarship = Scholarship::with(['scholarshipApplicants.user'])
            ->findOrFail($scholarshipId);

        $applicants = $scholarship->scholarshipApplicants->map(function ($applicant) {
            $applicant->pdf_url = url("storage/" . $applicant->pdf_path);
            return $applicant;
        });

        return response()->json([
            'scholarship_id' => $scholarship->id,
            'scholarship_name' => $scholarship->name,
            'applicants' => $applicants
        ]);
    }

}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Scholarship;
use App\Models\Applicant;

class ScholarshipController extends Controller
{
    // 🟢 Store new scholarship (admin)
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

    // 🔁 Get all scholarships
    public function index()
    {
        return Scholarship::all();
    }

    // 🟣 Apply to scholarship (student only)
    public function apply(Request $request, $id)
{
    $user = Auth::user();

    if ($user->type !== 'student') {
        return response()->json(['message' => 'Only students can apply'], 403);
    }

    $request->validate([
        'pdf' => 'required|file|mimes:pdf|max:2048',
        'email' => 'required|email',
        'name' => 'required|string',
    ]);

    $scholarship = Scholarship::findOrFail($id);

    $file = $request->file('pdf');
    $originalName = $file->getClientOriginalName(); 
    $path = $file->store('applications', 'public');

    $application = Applicant::updateOrCreate(
        ['user_id' => $user->id, 'scholarship_id' => $id],
        [
            'submitted_at' => now(),
            'pdf_path' => $path,
            'original_name' => $originalName,
            'user_name' => $user->name,
            'user_email' => $request->input('email'),
        ]
    );

    return response()->json([
        'message' => 'Applied successfully',
        'application' => $application,
    ]);
    }

    public function getApplicants($id)
{
    $scholarship = Scholarship::with('applicants.user')->findOrFail($id);

    return response()->json([
        'scholarship' => $scholarship->name,
        'applicants' => $scholarship->applicants,
    ]);
}

    public function allApplicants()
{
    $applicants = Applicant::with(['user', 'scholarship'])->get();

    return response()->json($applicants);
}

}

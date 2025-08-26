<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\AssistantshipModel\Assistantship;
use App\Models\AssistantshipModel\AssistantshipApplicant;
use App\Models\AssistantshipModel\AssistantshipApplicantFile;
use Illuminate\Support\Facades\Storage;

class AssistantshipController extends Controller
{
    public function store(Request $request)
    { // storing assistantship
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'pdf' => 'required|file|mimes:pdf|max:2048',
        ]);

        $file = $request->file('pdf');
        $originalName = $file->getClientOriginalName(); 
        $path = $request->file('pdf')->store('assistantships', 'public');

        $assistantship = Assistantship::create([
            'name' => $request->name,
            'description' => $request->description,
            'pdf_path' => $path,
            'original_name' => $originalName,
        ]);

        return response()->json($assistantship, 201);
    }

    public function approve(Request $request, $id){
        try { // approving assistantship
            $applicant = AssistantshipApplicant::findOrFail($id);

            $applicant->update([
                'status' => 'approved'
            ]);

            return response()->json(['message' => 'Student assistantship approved']);
        } catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], status: 500);
        }
    }

    public function index(){ // return all assitantship
        return Assistantship::all();
    }

    public function apply(Request $request, $id)
    {
        $request->validate([
            'files.*' => 'nullable|file|max:5120',
        ]);

        $user = Auth::user();

        $assistantship = Assistantship::findOrFail($id);

        $applicant = AssistantshipApplicant::create([
            'user_id' => $user->id,
            'assistantship_id' => $assistantship->id,
            'submitted_at' => now(),
            'status' => 'pending',
            'user_name' => $user->name,
            'user_email' => $user->email,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assistantship_files', 'public');

                AssistantshipApplicantFile::create([
                    'assistantship_applicant_id' => $applicant->id,
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Application submitted successfully',
            'applicant' => $applicant->load('files')
        ], 201);
    }

    public function getApplicant($userId)
    {
        $applications = AssistantshipApplicant::with('assistantship', 'files')
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            'user_id' => $userId,
            'applications' => $applications,
        ]);
    }

    public function allApplicants()
    { // getting all applicant
        $applicants = AssistantshipApplicant::with(['user', 'assistantship', 'files'])
            ->orderBy('submitted_at', 'desc')
            ->get();

        return response()->json($applicants);
    }


}

<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventApproval;
use App\Models\EventFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; 

class EventController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Reached EventController@store', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'type' => 'required|in:online,onsite,outside',
            'location' => 'nullable|string',
            'proposed_date' => 'required|date',
            'optional_date' => 'nullable|date',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ]);

        // Create event
        $event = Event::create([
            'student_org_id' => Auth::id(),
            'name' => $request->name,
            'short_description' => $request->short_description,
            'type' => $request->type,
            'location' => $request->location,
            'proposed_date' => $request->proposed_date,
            'optional_date' => $request->optional_date,
            'final_date' => $request->proposed_date,
        ]);

        $uploadedFiles = [];

        // Save files
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Generate unique but clean filename
                $uniqueName = uniqid() . '.' . $file->getClientOriginalExtension();

                // Save into storage/app/public/event_files
                $path = $file->storeAs('event_files', $uniqueName, 'public');

                $eventFile = EventFile::create([
                    'event_id' => $event->id,
                    'file_path' => $path, // this will now be like "event_files/64f9c1b2a3.docx"
                    'original_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);

                $uploadedFiles[] = [
                    'id' => $eventFile->id,
                    'original_name' => $eventFile->original_name,
                    'file_type' => $eventFile->file_type,
                    'file_size' => $eventFile->file_size,
                    'preview_url' => asset('storage/' . $eventFile->file_path),
                ];
            }
        }

        // Auto-assign approvers (unchanged)
        $approvers = [];
        $studentOrg = Auth::user();

        if ($studentOrg->org_advisor_id) {
            $orgAdvisor = User::find($studentOrg->org_advisor_id);
            if ($orgAdvisor) {
                $approvers[] = ['user_id' => $orgAdvisor->id, 'role' => 'org_advisor'];
            }
        }

        if ($studentOrg->dean_id) {
            $dean = User::find($studentOrg->dean_id);
            if ($dean) {
                $approvers[] = ['user_id' => $dean->id, 'role' => 'dean'];
            }
        }

        $eventAdmin = User::where('type', 'event_admin')->first();
        if ($eventAdmin) {
            $approvers[] = ['user_id' => $eventAdmin->id, 'role' => 'event_admin'];
        }

        $admin = User::where('type', 'admin')->first();
        if ($admin) {
            $approvers[] = ['user_id' => $admin->id, 'role' => 'admin'];
        }

        if ($event->type === 'outside') {
            $cesd = User::where('type', 'cesd_admin')->first();
            if ($cesd) {
                $approvers[] = ['user_id' => $cesd->id, 'role' => 'cesd_admin'];
            }
        }

        foreach ($approvers as $a) {
            EventApproval::create([
                'event_id' => $event->id,
                'user_id' => $a['user_id'],
                'role' => $a['role'],
                'status' => 'pending',
            ]);
        }

        return response()->json([
            'message' => 'Event created successfully!',
            'event' => $event,
            'files' => $uploadedFiles
        ], 201);
    }
    
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Only allow update if event is in "revision"
        if ($event->status !== 'revision') {
            return response()->json([
                'message' => 'You can only update an event if it is marked for revision.'
            ], 403);
        }

        // ✅ Validation (similar to store)
        $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'type' => 'required|in:online,onsite,outside',
            'location' => 'nullable|string',
            'proposed_date' => 'required|date',
            'optional_date' => 'nullable|date',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ]);

        // 1. Update details
        $event->update([
            'name' => $request->name,
            'short_description' => $request->short_description,
            'type' => $request->type,
            'location' => $request->location,
            'proposed_date' => $request->proposed_date,
            'optional_date' => $request->optional_date,
            'status' => 'pending', // ✅ Reset status for resubmission
        ]);

        // 2. Reset approval chain (back to first approver)
        $event->approvals()->update([
            'status' => 'pending',
            'remarks' => null,
            'approved_at' => null,
        ]);

        // 3. Remove old files if requested
        if ($request->has('removed_files')) {
            foreach ($request->removed_files as $fileId) {
                $file = $event->files()->where('id', $fileId)->first();
                if ($file) {
                    Storage::disk('public')->delete($file->file_path);
                    $file->delete();
                }
            }
        }

        // 4. Add new files if uploaded
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('event_files', 'public');

                $event->files()->create([
                    'original_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'Event updated and resubmitted successfully',
            'event' => $event->load('files', 'approvals'),
        ]);
    }



    public function approve(Request $request, $id)
    {
        Log::info('Approve called', [
            'event_id'      => $id,
            'auth_user_id'  => Auth::id(),
            'request_input' => $request->all(), // ✅ log all incoming data
        ]);

        try {
        $request->validate([
            'status'  => 'required|in:approved,rejected,revision',
            'remarks' => 'nullable|string',
        ]);

        $user = Auth::user(); 
        $userId = $user ? $user->id : null;

        Log::info('After validation', [
            'event_id' => $id,
            'user_id'  => $userId,
            'user_type'=> $user ? $user->type : null,
        ]);

        $approval = EventApproval::where('event_id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$approval) {
            $allApprovals = EventApproval::where('event_id', $id)->get();

            Log::info('Approval row not found', [
                'event_id'         => $id,
                'user_id'          => $userId,
                'all_approver_ids' => $allApprovals->pluck('user_id')->toArray(),
                'all_rows'         => $allApprovals->toArray(),
            ]);

            return response()->json(['message' => 'Approval record not found.'], 404);
        }

        Log::info('Approval row found', [
            'approval_id'   => $approval->id,
            'approval_type' => $approval->type,
            'approval_status'=> $approval->status,
        ]);

        // Check type matches role
        if ($user->type !== $approval->role) {
            return response()->json([
                'message' => 'You are not authorized to approve this step.',
                'debug' => [
                    'user_type' => $user->type,
                    'approval_role' => $approval->role,
                    'user_id' => $user->id,
                    'approval_user_id' => $approval->user_id
                ]
            ], 403);
        }

        // Prevent approving twice
        if ($approval->status !== 'pending') {
            return response()->json(['message' => 'You have already acted on this event.'], 403);
        }
        // Ensure previous approvers finished first
        $previousApprovals = EventApproval::where('event_id', $id)
            ->where('id', '<', $approval->id)
            ->where('status', '!=', 'approved')
            ->exists();

        if ($previousApprovals) {
            return response()->json(['message' => 'Previous approvers must approve first.'], 403);
        }
        // Update current approval
        $approval->update([
            'status'      => $request->status,
            'remarks'     => $request->remarks,
            'approved_at' => now(),
        ]);

        $event = $approval->event;

        // Rejected or revision → end flow
        if (in_array($request->status, ['rejected', 'revision'])) {
            $event->update(['status' => $request->status]);
            return response()->json(['message' => "Event marked as {$request->status}."]);
        }

        // If no pending approvals → mark event as approved
        $pending = EventApproval::where('event_id', $id)
            ->where('status', 'pending')
            ->exists();

        if (!$pending) {
            $event->update(['status' => 'approved']);
        }

        return response()->json(['message' => 'Approval updated successfully.']);
        }
        catch (\Exception $e) {
            Log::error('Error in approve method', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'An error occurred while processing approval.'], 500);
        }
    }


    // Show events created by logged-in student org
    public function myEvents()
    {
        $events = Event::where('student_org_id', Auth::id())
            ->with(['approvals.approver', 'files'])
            ->get();

        return response()->json($events);
    }

    // Show events pending for logged-in approver
    public function myPendingApprovals()
    {
        $approvals = EventApproval::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->with(['event.studentOrg', 'event.files'])
            ->get();

        return response()->json($approvals);
    }
    // Show event with full approval trail
    public function show($id)
    {
        $event = Event::with(['studentOrg', 'approvals.approver', 'files'])
            ->findOrFail($id);

        return response()->json($event);
    }
    public function approvedEvents()
    {
        $user = Auth::user();

        $events = Event::where('status', 'approved')
            ->with(['approvals.approver', 'files'])
            ->orderBy('proposed_date', 'asc') // sort by date so they can check availability
            ->get();

        return response()->json($events);
    }
    public function setFinalDate(Request $request, $id)
    {
        $request->validate([
            'final_date' => 'required|date|after_or_equal:today',
        ]);

        $user = Auth::user();

        // ✅ Only admin can set final date
        if ($user->type !== 'admin') {
            return response()->json(['message' => 'Only admin can set the final date.'], 403);
        }

        $event = Event::findOrFail($id);

        // ✅ Ensure event is fully approved first
        if ($event->status !== 'approved') {
            return response()->json(['message' => 'Event is not fully approved yet.'], 403);
        }

        // Save final date
        $event->update([
            'final_date' => $request->final_date,
        ]);

        return response()->json([
            'message' => 'Final date set successfully!',
            'event'   => $event,
        ]);
    }
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'student_org') {
            // student_org can only see their own events
            $events = Event::where('student_org_id', $user->id)
                ->with(['approvals.approver', 'files'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // approvers (org_advisor, dean, event_admin, admin, cesd_admin)
            // can see ALL events
            $events = Event::with(['approvals.approver', 'files'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($events);
    }

}

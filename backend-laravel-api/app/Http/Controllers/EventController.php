<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->type === 'admin') {
            // Admin sees everything
            return Event::with(['creator', 'orgAdvisor', 'dean', 'admin'])->get();
        }

        if ($user->type === 'dean') {
            // Dean sees events where they are assigned
            return Event::with(['creator', 'orgAdvisor'])
                ->where('dean_id', $user->id)
                ->get();
        }

        if ($user->type === 'org_advisor') {
            // Org advisor sees events where they are assigned
            return Event::with(['creator', 'dean'])
                ->where('org_advisor_id', $user->id)
                ->get();
        }

        if ($user->type === 'student_org') {
            // Student org sees their own events
            return Event::with(['orgAdvisor', 'dean', 'admin'])
                ->where('created_by', $user->id)
                ->get();
        }

        // Default fallback
        return response()->json([], 403);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->type !== 'student_org') {
            return response()->json(['error' => 'Only student_org users can create events'], 403);
        }

        $validated = $request->validate([
            'eventName' => 'required|string|max:255',
            'description' => 'required|string',
            'eventType' => 'required|in:Online,Onsite',
            'location' => 'nullable|string',
            'proposedDate' => 'required|date',
            'optionalDate' => 'nullable|date',
            'letter' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        // Store uploaded file
        $letterPath = $request->file('letter')->store('letters', 'public');

        // Create event
        $event = Event::create([
            'created_by' => $user->id,
            'org_advisor_id' => $user->org_advisor_id,
            'dean_id' => $user->dean_id,
            'admin_id' => 3, // hardcoded for now, or fetch dynamically if you want
            'event_name' => $validated['eventName'],
            'short_description' => $validated['description'],
            'event_type' => $validated['eventType'],
            'location' => $validated['eventType'] === 'Onsite' ? $validated['location'] : null,
            'proposed_date' => $validated['proposedDate'],
            'optional_date' => $validated['optionalDate'],
            'letter_path' => $letterPath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ]);
    }


   public function update(Request $request, Event $event)
    {
        try {
            $user = Auth::user();

            // Only the student_org who created the event can revise it
            if ($user->type !== 'student_org' || $user->id !== $event->created_by) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Ensure the event is currently in revision mode
            if (
                $event->status !== 'revision' ||
                !$event->revision_expires_at ||
                now()->greaterThan($event->revision_expires_at)
            ) {
                return response()->json(['error' => 'Revision window closed'], 400);
            }

            // Validate inputs
            $validated = $request->validate([
                'eventName' => 'required|string|max:255',
                'description' => 'required|string',
                'eventType' => 'required|in:Online,Onsite',
                'location' => 'nullable|string',
                'proposedDate' => 'required|date',
                'optionalDate' => 'nullable|date',
                'letter' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            ]);

            // Handle letter upload
            if ($request->hasFile('letter')) {
                if ($event->letter_path) {
                    Storage::disk('public')->delete($event->letter_path);
                }
                $event->letter_path = $request->file('letter')->store('letters', 'public');
            }

            // Update event fields
            $event->update([
                'event_name' => $validated['eventName'],
                'short_description' => $validated['description'],
                'event_type' => $validated['eventType'],
                'location' => $validated['eventType'] === 'Onsite' ? ($validated['location'] ?? null) : null,
                'proposed_date' => $validated['proposedDate'],
                'optional_date' => $validated['optionalDate'] ?? null,
                'letter_path' => $event->letter_path,
                'status' => 'pending', // Send back for approval again
                'revision_requested_at' => null,
                'revision_expires_at' => null,
                'rejection_reason' => null,
            ]);

            return response()->json(['message' => 'Event revised and resubmitted for approval']);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTrace(),
            ], 500);
        }
    }

    
    public function approveByOrgAdvisor(Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'org_advisor' || $user->id !== $event->org_advisor_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->org_advisor_approved_at || $event->org_advisor_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $event->update([
            'org_advisor_approved_at' => now(),
            'status' => 'advisor_approved'
        ]);

        return response()->json(['message' => 'Approved by Org Advisor']);
    }

    public function rejectByOrgAdvisor(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'org_advisor' || $user->id !== $event->org_advisor_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'reason' => 'required|string'
        ]);

        if ($event->org_advisor_approved_at || $event->org_advisor_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $event->update([
            'org_advisor_rejected_at' => now(),
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return response()->json(['message' => 'Rejected by Org Advisor']);
    }
    public function requestRevisionByOrgAdvisor(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'org_advisor' || $user->id !== $event->org_advisor_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->org_advisor_approved_at || $event->org_advisor_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $request->validate([
            'reason' => 'required|string'
        ]);

        $event->update([
            'status' => 'revision',
            'revision_requested_at' => now(),
            'revision_expires_at' => now()->addDay(),
            'rejection_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Revision requested by Org Advisor']);
    }



    public function approveByDean(Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'dean' || $user->id !== $event->dean_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Skip advisor check if not assigned
        if ($event->org_advisor_id && !$event->org_advisor_approved_at) {
            return response()->json(['error' => 'Advisor approval pending'], 400);
        }

        if ($event->dean_approved_at) {
            return response()->json(['message' => 'Already approved by dean']);
        }

        $event->update([
            'dean_approved_at' => now(),
        ]);

        return response()->json(['message' => 'Approved by Dean']);
    }

    public function rejectedByDean(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($user->type !=='dean' || $user->id !== $event->dean_id){
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $request->validate([
            'reason' => 'required|string'
        ]);
         
        if ($event->dean_approved_at || $event->dean_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $event->update([
            'dean_rejected_at' => now(),
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return response()->json(['message' => 'Rejected by Dean']);
    }

   public function requestRevisionByDean(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'dean' || $user->id !== $event->dean_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->dean_approved_at || $event->dean_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $request->validate([
            'reason' => 'required|string'
        ]);

        $event->update([
            'status' => 'revision',
            'revision_requested_at' => now(),
            'revision_expires_at' => now()->addDay(),
            'rejection_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Revision requested by Dean']);
    }




    public function approveByAdmin(Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'admin' || $user->id !== $event->admin_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$event->dean_approved_at) {
            return response()->json(['error' => 'Dean approval required'], 400);
        }

        if ($event->admin_approved_at || $event->admin_rejected_at) {
            return response()->json(['error' => 'Already processed by Admin'], 400);
        }


        $event->update([
            'admin_approved_at' => now(),
            'status' => 'approved',
        ]);

        return response()->json(['message' => 'Approved by Admin']);
    }

    public function rejectedByAdmin(Request $request, Event $event){
        $user = Auth::user();

        if ($user->type !=='admin' || $user->id !== $event->admin_id){
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $request->validate([
            'reason' => 'required|string'
        ]);
         
        if ($event->admin_approved_at || $event->admin_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        $event->update([
            'admin_rejected_at' => now(),
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return response()->json(['message' => 'Rejected by Admin']);
    }

    public function requestRevisionByAdmin(Request $request, Event $event)
    {
        $user = Auth::user();

        if ($user->type !== 'admin' || $user->id !== $event->admin_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->admin_approved_at || $event->admin_rejected_at) {
            return response()->json(['error' => 'Already processed'], 400);
        }

        if (!$event->dean_approved_at) {
            return response()->json(['error' => 'Dean approval required before admin revision'], 400);
        }

        $request->validate([
            'reason' => 'required|string'
        ]);

        $event->update([
            'status' => 'revision',
            'revision_requested_at' => now(),
            'revision_expires_at' => now()->addDay(),
            'rejection_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Revision requested by Admin']);
    }

}

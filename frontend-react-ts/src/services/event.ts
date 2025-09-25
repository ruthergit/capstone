// services/events.ts
import api from "./api";

// ---------------------------
// Event Types (optional, TS)
// ---------------------------
export interface EventFile {
  id: number;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  preview_url: string;
}

export interface Event {
  id: number;
  student_org_id: number;
  name: string;
  short_description: string;
  type: "online" | "onsite" | "outside";
  location?: string | null;
  proposed_date: string;
  optional_date?: string | null;
  final_date: string | null;
  status?: string;
  files?: EventFile[];
  approvals?: any[];
  student_org?: {
    id: number;
    name: string;
    login_id: string;
    type: string;
  };
}

// ---------------------------
// API Functions
// ---------------------------

// List events (depends on role: student_org = only theirs, approvers = all)
export const getEvents = async () => {
  const res = await api.get<Event[]>("/events");
  return res.data;
};

// Create event (with files)
export const createEvent = async (formData: FormData) => {
  const res = await api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const editEvent = async (formData: FormData, id: number) => {
  const res = await api.post(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Payload sent:", res);
  return res.data;
};

// List fully approved events (for student_org calendar, etc.)
export const getApprovedEvents = async () => {
  const res = await api.get<Event[]>("/events/approved");
  return res.data;
};

// Approve / Reject / Revision
export const approveEvent = async (
  id: number,
  data: { status: "approved" | "rejected" | "revision"; remarks?: string }
) => {
  const res = await api.post(`/events/${id}/approve`, data);
  return res.data;
};

// List events created by the logged-in student org
export const getMyEvents = async () => {
  const res = await api.get<Event[]>("/events/my");
  return res.data;
};


// List pending approvals for logged-in user
export const getMyPendingApprovals = async () => {
  const res = await api.get("/approvals/pending");
  return res.data;
};
export const getMyApprovalHistory = async () => {
  const res = await api.get("/approvals/history");
  return res.data;
}
// View full event details with approvals
export const getEventDetails = async (id: number) => {
  const res = await api.get<Event>(`/events/${id}`);
  return res.data;
};

// Set final date (only admin can)
export const setFinalDate = async (id: number, finalDate: string) => {
  const res = await api.post(`/events/${id}/final-date`, {
    final_date: finalDate,
  });
  return res.data;
};

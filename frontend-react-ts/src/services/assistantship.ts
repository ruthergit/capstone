import api from "./api";

export type Assistantship = {
  id?: number;
  name: string;
  description: string;
  pdf_path: string;
  pdf_url: string;
  original_name: string;
  created_at?: string;
  updated_at?: string;
};
export type AssistantshipApplicantFile = {
  id?: number;
  assistantship_applicant_id: number;
  file_path: string;
  original_name: string;
  file_type: string;
  file_size: number;
  created_at?: string;
  updated_at?: string;
  file_url: string;
};

export type AssistantshipApplicant = {
  id?: number;
  user_id: number;
  assistantship_id: number;
  created_at?: string;
  submitted_at?: string; 
  status: string
  user_name: string;
  user_email: string;

  // relations
  user?: {
    id: number;
    name: string;
    email: string;
  };
  assistantship?: Assistantship;
  files?: AssistantshipApplicantFile[];
};

export const getAssistantship = async () => {
  const response = await api.get<Assistantship[]>("/assistantships");
  return response.data;
};

export const addAssistantship = async ( name: string, description: string, pdf: File) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("pdf", pdf);

  const response = await api.post("/assistantships", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const applyAssistantship = async (id: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files[]", file);
  });

  const response = await api.post(`/assistantships/${id}/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const approveAssistantshipApplicant = async (id: number) => {
  const response = await api.post(`/assistantship-applicants/${id}/approve`);
  return response.data;
};

export const rejectAssistantshipApplicant = async (id: number) => {
  const response = await api.post(`/assistantship-applicants/${id}/reject`);
  return response.data;
};

export const getAssistantshipApplications = async (id: number) => {
  const response = await api.get(`/assistantships/${id}/applicants`);
  return response.data;
}

export const getAssistantshipApplicant = async () => {
  const response = await api.get<AssistantshipApplicant[]>("/assistantship-applicants");
  return response.data;
}

export const getUserAssistantshipApplications = async (userId: number) => {
  const res = await api.get(`/assistantships/${userId}/assistantship-applications`)
  return res.data.applications;
};
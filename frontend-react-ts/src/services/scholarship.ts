import api from "./api";

export type Scholarship = {
  id?: number;
  name: string;
  pdf_path: string;
  pdf_url: string;
  original_name: string;
  created_at?: string;
  updated_at?: string;
};
export type Applicant = {
  id?: number;
  user_name: string;
  user_email: string;
  pdf_path: string;
  original_name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export const getScholarship = async () => {
  const response = await api.get<Scholarship[]>("/scholarships");
  return response.data;
};

export const addScholarship = async (name: string, pdf: File) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("pdf", pdf);

  const response = await api.post("/scholarships", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const applyScholarship = async (id: number, pdf: File) => {
  const formData = new FormData();
  formData.append("pdf", pdf);

  const response = await api.post(`/scholarships/${id}/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const approveScholarship = async (id: number) => {
  const response = await api.post(`/scholarships/${id}/approve`);
  return response.data;
};

export const getScholarshipApplicant = async () => {
  const response = await api.get<Applicant[]>("/applicants");
  return response.data;
};

export const getStudentDetails = async () => {
  const response = await api.get("/api/me");
  return response.data;
};

export const getUserScholarshipApplications = async (userId: number) => {
  const res = await api.get(`/scholarships/${userId}/applicant`)
  return res.data.applications;
};
import api from "./api";

export type Scholarship = {
  id?: number;
  name: string;
  pdf_path: string;
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

export const applyScholarship = async (
  id: number,
  name: string,
  email: string,
  pdf: File
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("pdf", pdf);

  const response = await api.post(`/scholarships/${id}/apply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getApplicant = async () => {
  const response = await api.get<Applicant[]>("/applicants");
  return response.data;
};

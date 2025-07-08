import api from './api';

export interface User {
  id: number;
  name: string;
  login_id: string;
  type: 'admin' | 'student' | 'student_org' | 'faculty' | 'org_advisor' | 'dean';
  created_at?: string;
  updated_at?: string;
}

export const getUsersByLoginIds = async (loginIds: string[]): Promise<User[]> => {
  const response = await api.post<User[]>('/users/multiple', {
    login_ids: loginIds,
  });
  return response.data;
};

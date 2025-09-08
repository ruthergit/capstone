import api from "./api";

export type Notification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    title: string;
    body: string;
    action_url: string;
    scholarship_name?: string;
    assistantship_name?: string;
    approved_at: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export const getUserNotifications = async (userId: number) => {
  const response = await api.get<Notification[]>(`/user/${userId}/notifications`);
  return response.data;
};

export const markNotificationAsRead = async (userId: number, notificationId: string) => {
  const response = await api.post(`/user/${userId}/notifications/${notificationId}/read`);
  return response.data;
};

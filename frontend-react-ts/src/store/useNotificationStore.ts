import { create } from "zustand";
import {
  getUserNotifications,
  markNotificationAsRead,
  type Notification as ApiNotification,
} from "../services/notifications";

import { type Notification as UiNotification } from "../types/notification";

type State = {
  notifications: UiNotification[];
};

type Actions = {
  fetch: (userId: number) => Promise<void>;
  markOneAsRead: (userId: number, id: string) => Promise<void>;
};

export const useNotificationStore = create<State & Actions>((set) => ({
  notifications: [],

  fetch: async (userId) => {
    const data = await getUserNotifications(userId);
    console.log("Fetched notifications:", data);

    const mapped: UiNotification[] = data.map((n: ApiNotification) => ({
      id: n.id,
      title: n.data.title,
      message: n.data.body,
      actionUrl: n.data.action_url,
      time: new Date(n.created_at).toLocaleString(),
      read: n.read_at !== null,
      raw: n,
    }));

    set({ notifications: mapped });
  },

  markOneAsRead: async (userId, id) => {
    await markNotificationAsRead(userId, id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
}));

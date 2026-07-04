import { create } from "zustand";
import type { AppNotification, NotificationType } from "../types";

interface NotificationStore {
  notifications: AppNotification[];

  notify: (type: NotificationType, title: string, message: string) => void;

  dismiss: (id: string) => void;

  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clear: () => set({ notifications: [] }),

  notify: (type, title, message) => {
    const id = crypto.randomUUID();

    const notification: AppNotification = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      get().dismiss(id);
    }, 5000);
  },
}));

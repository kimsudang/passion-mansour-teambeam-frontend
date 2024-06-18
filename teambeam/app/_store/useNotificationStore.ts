import create from "zustand";
import { NotificationType } from "@/app/_components/Header";

interface INotificationState {
  notifications: NotificationType[];
  filterNotification: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  setFilterNotification: (filterNotification: NotificationType[]) => void;
}

const useNotificationStore = create<INotificationState>((set) => ({
  notifications: [],
  filterNotification: [],
  setNotifications: (notifications) => set({ notifications }),
  setFilterNotification: (filterNotification) => set({ filterNotification }),
}));

export default useNotificationStore;

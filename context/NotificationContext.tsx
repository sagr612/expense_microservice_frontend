import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Notification } from "@/constants/types";
import Toast from "react-native-toast-message";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../app/services/notificationService";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  refresh: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log("Error fetching notifications", err);
      Toast.show({
        type: "error",
        text1: "Couldn't load notifications",
        text2: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.log(err);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshNotifications();
    refreshUnreadCount();
  }, []);

  const refresh = async () => {
    await Promise.all([refreshNotifications(), refreshUnreadCount()]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh,
        refreshNotifications,
        refreshUnreadCount,
        markNotificationRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }

  return context;
};

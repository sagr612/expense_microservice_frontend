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
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;

  refresh: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  loadMore: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const { isAuthenticated } = useAuth();

  const refreshNotifications = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      setLoading(true);
      const data = await getNotifications(0, 20);
      const items = Array.isArray(data) ? data : (data?.content ?? []);
      setNotifications(items);
      setPage(0)
      setHasMore(!data?.last && items.length === 20)
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
  const loadMore = async () => {
    if (loading || isLoadingMore || !hasMore || !isAuthenticated) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await getNotifications(nextPage, 20);
      const newItems = Array.isArray(data) ? data : (data?.content ?? []);
      if (newItems.length > 0) {
        setNotifications((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      }
      setHasMore(!data?.last && newItems.length === 20);
    } catch (err) {
      console.error("Error loading more notifications", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refreshUnreadCount = async () => {
    if (!isAuthenticated) {
      return;
    }
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
    if (isAuthenticated) {
      refreshNotifications();
      refreshUnreadCount();
    } else {
      setPage(0)
      setHasMore(true)
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const refresh = async () => {
    if (!isAuthenticated) {
      return;
    }
    await Promise.all([refreshNotifications(), refreshUnreadCount()]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        isLoadingMore,
        hasMore,
        loadMore,
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

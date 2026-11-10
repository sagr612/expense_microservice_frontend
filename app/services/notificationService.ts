// import AsyncStorage from "@react-native-async-storage/async-storage";
import { PagedResponse, Notification } from "@/constants/types";
import { expenseApi } from "./api";
import * as SecureStore from "expo-secure-store";

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("accessToken");

  return {
    Authorization: `Bearer ${token}`,
  };
};
export const registerPushToken = async (expoToken: string) => {
  const response = await expenseApi.post(
    "/api/v1/notifications/register-token",
    {
      expoToken,
    },
    {
      headers: await getAuthHeaders(),
    },
  );
  console.log("Push token registered successfully:", response.data);
  return response.data;
};

export const getNotifications = async (page: number = 0, size: number = 20) => {
  const response = await expenseApi.get<PagedResponse<Notification>>(
    `/api/v1/notifications?page=${page}&size=${size}`,
    {
      headers: await getAuthHeaders(),
    },
  );

  return response.data;
};

export const markAsRead = async (id: string) => {
  await expenseApi.patch(
    `/api/v1/notifications/${id}/read`,
    {},
    {
      headers: await getAuthHeaders(),
    },
  );
};

export const getUnreadCount = async () => {
  const response = await expenseApi.get("/api/v1/notifications/unread-count", {
    headers: await getAuthHeaders(),
  });

  return response.data;
};

export const unregisterPushToken = async () => {
  try {
    await expenseApi.delete("/api/v1/notifications/token", {
      headers: await getAuthHeaders(),
    });
  } catch (err) {
    console.warn("Failed to unregister push token:", err);
  }
};

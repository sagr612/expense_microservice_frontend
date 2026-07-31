// import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const getNotifications = async () => {
  const response = await expenseApi.get("/api/v1/notifications", {
    headers: await getAuthHeaders(),
  });

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

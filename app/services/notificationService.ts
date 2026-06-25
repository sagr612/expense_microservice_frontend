import AsyncStorage from "@react-native-async-storage/async-storage";
import { expenseApi } from "./api";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");

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

import { userApi } from "@/app/services/api";
import { UserInfoDto } from "@/interfaces/UserTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUser = async (userId: string): Promise<UserInfoDto> => {
  const token = await AsyncStorage.getItem("accessToken");

  const response = await userApi.get(`/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const token = await AsyncStorage.getItem("accessToken");

  await userApi.delete(`/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createUpdateUser = async (
  userInfo: UserInfoDto,
): Promise<UserInfoDto> => {
  const token = await AsyncStorage.getItem("accessToken");

  const response = await userApi.post("/api/v1/users", userInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const uploadAvatar = async (
  userId: string,
  formData: FormData,
): Promise<void> => {
  const token = await AsyncStorage.getItem("accessToken");

  try {
    const response = await userApi.patch(
      `/api/v1/users/${userId}/profile-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      },
    );

    console.log("resp", response);
  } catch (error: any) {
    console.log(
      "Avatar upload request failed:",
      error?.response?.data ?? error,
    );
    throw error;
  }
};

import { userApi } from "@/app/services/api";
import * as userService from "@/app/services/userService";
import { UserContextType, UserInfoDto } from "@/interfaces/UserTypes";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const deleteUser = async (userId: string) => {
    try {
      console.log("Deleting user ", userId, "......");
      const response = await userService.deleteUser(userId);

      console.log(response);
      console.log("User deleted successfully.");
    } catch (err) {
      console.error("Error while deleting a user", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async (userId: string) => {
    try {
      console.log("Getting user ", userId, "......");
      const user = await userService.getUser(userId);
      console.log(user);
      setUser(user);
      console.log("User fetched successfully.");
    } catch (err) {
      console.error("Error while fetching a user", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUpdateUser = async (userInfo: UserInfoDto) => {
    try {
      console.log("Creating Updating user ", userInfo.user_id, "......");
      const user = await userService.createUpdateUser(userInfo);

      console.log(user);
      setUser(user);
      console.log("User updated successfully.");
    } catch (err) {
      console.error("Error while updating a user", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (userId: string, formData: FormData) => {
    try {
      console.log("Uploading avatar for user ", userId, "......");
      await userService.uploadAvatar(userId, formData);

      console.log("Avatar uploaded successfully.");
    } catch (err) {
      console.error("Error while uploading avatar", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        deleteUser,
        isLoading,
        getUser,
        createUpdateUser,
        uploadAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

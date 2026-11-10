import {
  changePassword as changePasswordRequest,
  changeUsername as changeUsernameRequest,
  login as loginRequest,
  refreshToken as refreshTokenRequest,
  signup as signupRequest,
} from "@/app/services/authService";
import {
  registerPushToken,
  unregisterPushToken,
} from "@/app/services/notificationService";
import { getExpoPushToken } from "@/app/services/pushTokenService";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber: string,
    email: string,
    password: string,
  ) => Promise<void>;
  userId: string | null;
  isAuthenticated: boolean;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  changeUsername: (
    newUsername: string,
    currentUsername: string,
  ) => Promise<void>;
}

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  userId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
    const syncPushToken = async () => {
      if (!userId) return;

      try {
        const expoToken = await getExpoPushToken();

        if (expoToken) {
          await registerPushToken(expoToken);
        }
      } catch (err) {
        console.log(err);
      }
    };

    syncPushToken();
  }, [userId]);

  const loadStoredAuth = async () => {
    try {
      console.log("📦 Loading stored auth...");

      // const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const storedAccessToken = await SecureStore.getItemAsync("accessToken");

      const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
      const storedUser = await SecureStore.getItemAsync("user");
      const storedUserId = await SecureStore.getItemAsync("userId");

      console.log("Stored user:", storedUser);
      console.log("Stored userid:", storedUserId);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        const decoded = jwtDecode<JwtPayload>(storedAccessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          // ✅ Token still valid, restore session
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUser(storedUser);
          setUserId(storedUserId);
          console.log("✅ Auth restored from storage");
        } else {
          // ⚠️ Access token expired, try refresh
          console.log("⚠️ Access token expired, refreshing...");
          await handleTokenRefresh(storedRefreshToken);
        }
      } else {
        console.log("No stored auth found");
      }
    } catch (error) {
      console.error("❌ Failed to load auth from storage:", error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const { accessToken: newAccessToken, token: newRefreshToken } =
        await changePasswordRequest({ oldPassword, newPassword });
      console.log("✅ Password changed successfully");

      const decoded = jwtDecode<JwtPayload>(newAccessToken);

      const userFromToken = decoded.sub;
      const userId_1 = decoded.userId;

      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", userFromToken);
      await SecureStore.setItemAsync("userId", userId_1);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userFromToken);
      setUserId(userId_1);
    } catch (error) {
      console.error("❌ Failed to change password:", error);
      throw error;
    }
  };
  const changeUsername = async (
    newUsername: string,
    currentUsername: string,
  ) => {
    try {
      const { accessToken: newAccessToken, token: newRefreshToken } =
        await changeUsernameRequest({ newUsername });
      console.log("✅ Username changed successfully");

      const decoded = jwtDecode<JwtPayload>(newAccessToken);

      const userFromToken = decoded.sub;
      const userId_1 = decoded.userId;

      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", userFromToken);
      await SecureStore.setItemAsync("userId", userId_1);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userFromToken);
      setUserId(userId_1);
    } catch (error) {
      console.error("❌ Failed to change username:", error);
      throw error;
    }
  };

  const handleTokenRefresh = async (storedRefreshToken: string) => {
    try {
      const { accessToken: newAccessToken, token: newRefreshToken } =
        await refreshTokenRequest(storedRefreshToken);
      console.log("✅ Token refreshed successfully");

      const decoded = jwtDecode<JwtPayload>(newAccessToken);

      const userFromToken = decoded.sub;
      const userId_1 = decoded.userId;
      console.log("decoded:", decoded);
      console.log("userid:", userId_1);
      console.log("user from token:", userFromToken);
      console.log("new access token:", newAccessToken);
      console.log("new refresh token:", newRefreshToken);
      // ✅ Save new tokens to storage
      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", userFromToken);
      await SecureStore.setItemAsync("userId", userId_1);

      // ✅ Update state
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userFromToken);
      setUserId(userId_1);
    } catch (error) {
      console.error("❌ Token refresh failed, logging out:", error);
      await clearAuth();
      throw error;
    }
  };

  const clearAuth = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("userId");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setUserId(null);
  };

  const login = async (username: string, password: string) => {
    console.log("🔐 Attempting login:", username);

    try {
      setIsLoading(true);

      const { accessToken: newAccessToken, token: newRefreshToken } =
        await loginRequest(username, password);
      const decoded = jwtDecode<JwtPayload>(newAccessToken);

      const userFromToken = decoded.sub;
      const userId_1 = decoded.userId;

      console.log("userid:", userId_1);
      console.log("userid ", userId_1);
      // ✅ Save to storage
      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", userFromToken);
      await SecureStore.setItemAsync("userId", userId_1);

      // ✅ Update state
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userFromToken);
      setUserId(userId_1);

      console.log("✅ Navigating to home...");
      router.replace("/(root)");
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      try {
        await unregisterPushToken();
      } catch (error) {
        console.log("Push token unregister error", error);
      }
      await clearAuth();
      console.log("Logged out successfully");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber: string,
    email: string,
    password: string,
  ) => {
    try {
      setIsLoading(true);
      const { accessToken: newAccessToken, token: newRefreshToken } =
        await signupRequest({
          first_name: firstName,
          last_name: lastName,
          username: userName,
          phone_number: phoneNumber,
          email,
          password,
        });
      const decoded = jwtDecode<JwtPayload>(newAccessToken);

      const userFromToken = decoded.sub;
      const userId_1 = decoded.userId;

      console.log("userid:", userId_1);
      console.log("userid ", userId_1);
      // ✅ Save to storage
      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", userFromToken);
      await SecureStore.setItemAsync("userId", userId_1);

      // ✅ Update state
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userFromToken);
      setUserId(userId_1);

      console.log("✅ Navigating to home...");
      router.replace("/(root)");
    } catch (error: any) {
      console.error("❌ signup error:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isLoading,
        user,
        login,
        logout,
        userId,
        signUp,
        isAuthenticated: !!accessToken && !!user,
        changePassword,
        changeUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

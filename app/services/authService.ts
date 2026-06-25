import {authApi} from "@/app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthResponse {
    accessToken: string;
    token: string;
}

export const login = async (
    username: string,
    password: string,
): Promise<AuthResponse> => {
    try {
        console.log("🔐 Attempting login:", username);
        const response = await authApi.post<AuthResponse>("/auth/v1/login", {
            username,
            password,
        });

        console.log("✅ Login success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const signup = async (payload: {
    first_name: string;
    last_name: string;
    username: string;
    phone_number: number;
    email: string;
    password: string;
}): Promise<AuthResponse> => {
    try {
        console.log("📝 Attempting signup:", payload.username);
        const response = await authApi.post<AuthResponse>(
            "/auth/v1/signup",
            payload,
        );

        console.log("✅ Signup success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Signup error:", error.response?.data || error.message);
        throw error;
    }
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
    try {
        console.log("🔄 Attempting token refresh");

        const response = await authApi.post<AuthResponse>("/auth/v1/refreshToken", {
            token,
        });

        console.log("✅ Token refresh success");
        return response.data;
    } catch (error: any) {
        console.error(
            "❌ Token refresh error:",
            error.response?.data || error.message,
        );
        throw error;
    }
};

export const changePassword = async (payload: {
    oldPassword: string;
    newPassword: string;
}): Promise<AuthResponse> => {
    try {
        console.log("🔄 Attempting password change");
        const token = await AsyncStorage.getItem("accessToken");

        const response = await authApi.post<AuthResponse>(
            "/auth/v1/change/passwords",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log("✅ Login success:", response.data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.response?.data ||
            "Password change failed";

        throw new Error(message);
    }
};

export const changeUsername = async (payload: {
    newUsername: string;
    currentUsername: string;
}): Promise<AuthResponse> => {
    try {
        console.log("🔄 Attempting username change");
        const token = await AsyncStorage.getItem("accessToken");

        const response = await authApi.post<AuthResponse>(
            "/auth/v1/change/username",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log("✅ Username changed successfully:", response.data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.response?.data ||
            "Username change failed";
        throw new Error(message);
    }
};

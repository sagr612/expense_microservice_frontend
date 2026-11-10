// app/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// ─── Dev Machine IP ────────────────────────────────────────────────────────
// Used ONLY as a fallback when Expo cannot auto-detect the host.
// Expo normally resolves this automatically via hostUri when Metro is running.
// Update this if your IP changes (run `ipconfig` to find it).
const DEV_MACHINE_IP = "10.160.120.163";

const getHost = () => {
  if (__DEV__) {
    const { expoConfig } = Constants;
    // expoConfig.hostUri is e.g. "10.160.120.163:8081" on a physical device
    const debuggerHost = expoConfig?.hostUri;
    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      // Accept any valid non-loopback IP from Expo
      if (host && host !== "localhost" && !host.startsWith("exp://")) {
        return host;
      }
    }
    // Fallback: use the hardcoded LAN IP so physical devices can always connect
    return DEV_MACHINE_IP;
  }
  // prod host / domain
  return "your-api-domain.com";
};

const HOST = getHost();

// adjust ports to match your Spring Boot services
export const AUTH_BASE_URL = __DEV__
  ? `http://${HOST}:8080`
  : `https://your-auth-service.example.com`;

export const USER_BASE_URL = __DEV__
  ? `http://${HOST}:8080`
  : `https://your-user-service.example.com`;

export const EXPENSE_BASE_URL = __DEV__
  ? `http://${HOST}:8080`
  : `https://your-expense-service.example.com`;

// AI-SMS service is routed through the same gateway
export const AI_BASE_URL = EXPENSE_BASE_URL;

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const userApi = axios.create({
  baseURL: USER_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const expenseApi = axios.create({
  baseURL: EXPENSE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── 401 Auto-Refresh Interceptor ──────────────────────────────────────────
//
// When any protected API call returns 401 (token expired):
//   1. Attempt a single token refresh via /auth/v1/refreshToken
//   2. Retry all queued requests with the new token
//   3. If refresh also fails → clear storage (force logout)
//
// The isRefreshing flag + failedQueue prevent a "refresh storm" when
// multiple requests fail with 401 simultaneously — only ONE refresh call
// is made; all others wait in the queue.
// ─────────────────────────────────────────────────────────────────────────

let isRefreshing = false;

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token!);
    }
  });
  failedQueue = [];
};

const clearAuthStorage = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("userId");
};

/**
 * Attaches a 401 response interceptor to any axios instance.
 * Uses the shared authApi to refresh tokens to avoid circular calls.
 */
const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only handle 401s that haven't already been retried
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another refresh is already in progress — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken =
          await SecureStore.getItemAsync("refreshToken");

        if (!storedRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await authApi.post<{
          accessToken: string;
          token: string;
        }>("/auth/v1/refreshToken", { token: storedRefreshToken });

        const { accessToken: newAccessToken, token: newRefreshToken } =
          response.data;

        // Persist new tokens
        await SecureStore.setItemAsync("accessToken", newAccessToken);
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);

        console.log("✅ Token refreshed by interceptor");

        // Flush the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed, clearing auth:", refreshError);
        processQueue(refreshError, null);
        await clearAuthStorage();
        // The AuthContext will detect missing tokens on next mount / navigation
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};

// Attach to all authenticated instances (not authApi — it handles login/refresh itself)
attachRefreshInterceptor(expenseApi);
attachRefreshInterceptor(userApi);
attachRefreshInterceptor(aiApi);


// app/services/api.ts
import axios from "axios";
import Constants from "expo-constants";

const getHost = () => {
  if (__DEV__) {
    const { expoConfig } = Constants;
    const debuggerHost = expoConfig?.hostUri;
    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      if (host && host !== "localhost" && !host.includes("exp://")) {
        return host;
      }
    }
    // fallback dev IP
    return "localhost";
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

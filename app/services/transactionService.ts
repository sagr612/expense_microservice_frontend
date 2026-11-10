import { expenseApi } from "@/app/services/api";
import {
  BudgetDto,
  CategoryAnalyticsResponse,
  CategoryType,
  MonthlyAnalyticsDto,
  PagedResponse,
  Transaction,
} from "@/constants/types";
import { Summary } from "@/interfaces/UserTypes";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// export interface TransactionPayload {
//   title: string;
//   amount: number;
//   category: string;
//   type: "income" | "expense";
//   note?: string;
// }

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("accessToken");

  return {
    Authorization: `Bearer ${token}`,
  };
};
export const getTransactions = async (
  userId: string,
  page: number = 0,
  size: number = 100,
): Promise<PagedResponse<Transaction>> => {
  try {
    console.log(
      "Fetching transactions for user:",
      userId,
      " page:",
      page,
      " size:",
      size,
    );
    const token = await SecureStore.getItemAsync("accessToken");

    const response = await expenseApi.get<PagedResponse<Transaction>>(
      "/api/v1/expenses",
      {
        params: {
          page,
          size,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Successfully fetched :", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error while fetching transactions for user :",
      userId,
      " : ",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getTransaction = async (
  userId: string,
  externalId: string,
): Promise<Transaction> => {
  try {
    console.log("Fetching transaction for external ID:", externalId);
    const token = await SecureStore.getItemAsync("accessToken");

    const response = await expenseApi.get<Transaction>(
      `/api/v1/expenses/${externalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Successfully fetched :", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error while fetching transaction for external ID :",
      externalId,
      " : ",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createTransaction = async (
  payload: Transaction,
  userId: string,
): Promise<Transaction> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    console.log("Creating transaction for user:", payload.userId);
    const response = await expenseApi.post<Transaction>(
      "/api/v1/expenses",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Successfully created transaction for user:", payload.userId);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error while creating transaction for user :",
      payload.userId,
      " : ",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteTransaction = async (
  userId: string,
  externalId: string,
): Promise<void> => {
  try {
    console.log("Deleting transaction for external ID:", externalId);
    const token = await SecureStore.getItemAsync("accessToken");

    await expenseApi.delete(`/api/v1/expenses/${externalId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "Successfully deleted transaction with external ID:",
      externalId,
    );
  } catch (error: any) {
    console.error(
      "Error while deleting transaction for external ID :",
      externalId,
      " : ",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateTransaction = async (
  payload: Transaction,
  userId: string,
): Promise<Transaction> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    console.log("updating transaction for user:", payload.userId);
    const response = await expenseApi.put<Transaction>(
      "/api/v1/expenses",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Successfully updated transaction for user:", payload.userId);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error while updating transaction for user :",
      payload.userId,
      " : ",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getCategoryAnalytics = async (
  userId: string,
): Promise<CategoryAnalyticsResponse> => {
  try {
    const response = await expenseApi.get<CategoryAnalyticsResponse>(
      "/api/v1/expenses/analytics/category",
      {
        headers: await getAuthHeaders(),
      },
    );
    console.log("Successfully fetched category analytics for user:", userId);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching category analytics:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

export const getMonthlyAnalytics = async (
  userId: string,
): Promise<MonthlyAnalyticsDto[]> => {
  try {
    const response = await expenseApi.get<MonthlyAnalyticsDto[]>(
      "/api/v1/expenses/analytics/monthly",
      {
        headers: await getAuthHeaders(),
      },
    );
    console.debug("Successfully fetched monthly analytics:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching monthly analytics:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

export const getBudgetStatus = async (month: number, year: number) => {
  const response = await expenseApi.get(
    `/api/v1/expenses/budgets/status?month=${month}&year=${year}`,
    {
      headers: await getAuthHeaders(),
    },
  );

  return response.data;
};

export const createBudget = async (budget: BudgetDto): Promise<BudgetDto> => {
  const response = await expenseApi.post<BudgetDto>(
    "/api/v1/expenses/budgets",
    budget,
    {
      headers: await getAuthHeaders(),
    },
  );
  console.log("Successfully created budget:", response.data);
  return response.data;
};

export const getSummary = async (): Promise<Summary> => {
  const response = await expenseApi.get<Summary>("/api/v1/expenses/summary", {
    headers: await getAuthHeaders(),
  });
  console.log("Successfully fetched summary");
  return response.data;
};

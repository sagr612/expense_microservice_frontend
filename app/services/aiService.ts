// app/services/aiService.ts
import { aiApi } from "@/app/services/api";
import * as SecureStore from "expo-secure-store";

export interface SmsExpenseEvent {
  externalId: string;
  userId: string;
  amount: number;
  currency: string;
  type: "EXPENSE" | "INCOME";
  category: string;
  title: string;
  note: string;
  transactionDate: string;
}

export interface SmsClassifyResponse {
  label: string; // "expense" | "income" | "irrelevant"
  confidence: number; // 0.0 - 1.0
  autoCreated: boolean;
  degraded?: boolean; // TRUE if gemini LLm timed out & regex fallback was used
  event?: SmsExpenseEvent | null;
}

export const classifySms = async (
  smsText: string,
  userId: string,
): Promise<SmsClassifyResponse> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    const response = await aiApi.post<SmsClassifyResponse>(
      "/api/v1/sms/classify",
      { smsText },
      {
        headers: {
          "X-User-Id": userId,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("✅ SMS classified:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error classifying SMS:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

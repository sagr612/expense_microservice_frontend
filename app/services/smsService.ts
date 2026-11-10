// app/services/smsService.ts
import {
  checkIfHasSMSPermission,
  requestReadSMSPermission,
  startReadSMS,
} from "@maniac-tech/react-native-expo-read-sms";
import { Platform } from "react-native";
import SmsListener from "react-native-android-sms-listener";

export interface SmsMessage {
  sender: string;
  body: string;
  timestamp: number;
}

const FINANCE_KEYWORDS = [
  "debited",
  "credited",
  "spent",
  "paid",
  "received",
  "upi",
  "bank",
  "account",
  "avail bal",
  "balance",
  "txn",
  "transaction",
  "ref",
];

/**
 * Checks if the app has SMS permissions on Android.
 */
export const checkSmsPermission = async (): Promise<{
  hasReceiveSmsPermission: boolean;
  hasReadSmsPermission: boolean;
}> => {
  if (Platform.OS !== "android") {
    return {
      hasReceiveSmsPermission: false,
      hasReadSmsPermission: false,
    };
  }

  try {
    const result = await checkIfHasSMSPermission();
    return result;
  } catch (error) {
    console.error("❌ Error checking SMS permission:", error);
    return {
      hasReceiveSmsPermission: false,
      hasReadSmsPermission: false,
    };
  }
};

/**
 * Requests READ_SMS / RECEIVE_SMS permission on Android.
 */
export const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") {
    console.warn("⚠️ SMS reading is only supported on Android");
    return false;
  }

  try {
    const granted = await requestReadSMSPermission();
    console.log(
      granted ? "✅ SMS permission granted" : "❌ SMS permission denied",
    );
    return granted;
  } catch (error) {
    console.error("❌ Error requesting SMS permission:", error);
    return false;
  }
};

/**
 * Checks if an SMS body is likely a financial/transaction message.
 */
export const isTransactionSms = (body: string): boolean => {
  const lower = body.toLowerCase();
  return FINANCE_KEYWORDS.some((keyword) => lower.includes(keyword));
};

/**
 * Starts SMS listeners (both foreground and background persistent).
 * Keeps listening even when user minimizes or switches to other apps.
 */
export const startSmsListener = (
  onSmsReceived: (message: SmsMessage) => void,
): (() => void) | null => {
  if (Platform.OS !== "android") {
    console.warn("⚠️ SMS reading is only supported on Android");
    return null;
  }

  let foregroundSub: { remove: () => void } | null = null;

  // 1. Foreground listener
  try {
    foregroundSub = SmsListener.addListener((message: any) => {
      const sender = message?.originatingAddress ?? "UNKNOWN";
      const body = message?.body ?? "";
      const timestamp = message?.timestamp ?? Date.now();

      console.log(
        `📩 [Foreground SMS Received] From: ${sender} | Body: "${body.slice(0, 80)}"`,
      );

      if (body.trim()) {
        onSmsReceived({ sender, body, timestamp });
      }
    });
    console.log("✅ Foreground SMS listener active");
  } catch (error) {
    console.error("❌ Error starting foreground SMS listener:", error);
  }

  // 2. Background persistent listener (doesn't unregister when app is paused)
  try {
    startReadSMS(
      (statusOrData: any, maybeSms?: any) => {
        const rawData = maybeSms ?? statusOrData;
        console.log(`📩 [Background SMS Broadcast]:`, rawData);
        let sender = "";
        let body = "";
        // Formatted as "[address, body]"
        if (typeof rawData === "string") {
          const match = rawData.match(/^\[(.*?),\s*([\s\S]*)\]$/);
          if (match) {
            sender = match[1];
            body = match[2];
          } else {
            body = rawData;
          }
        }
        if (body && body.trim()) {
          console.log(
            `📩 Extracted From: ${sender || "BANK"} | Body: "${body}"`,
          );
          onSmsReceived({
            sender: sender || "BANK",
            body,
            timestamp: Date.now(),
          });
        }
      },
      (error: any) => {
        console.warn("⚠️ Background SMS error:", error);
      },
    );
    console.log("✅ Background-persistent SMS listener active");
  } catch (error) {
    console.error("❌ Error starting background SMS listener:", error);
  }
  return () => {
    foregroundSub?.remove?.();
    console.log("🛑 Foreground SMS listener removed");
  };
};


export default SmsListener;
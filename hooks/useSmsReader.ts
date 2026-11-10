import { SmsExpenseEvent, classifySms } from "@/app/services/aiService";
import {
  checkSmsPermission,
  isTransactionSms,
  requestSmsPermission,
  startSmsListener,
  SmsMessage,
} from "@/app/services/smsService";
import { useAuth } from "@/context/AuthContext";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

interface SmsReaderState {
  permissionGranted: boolean;
  listenerActive: boolean;
  pendingEvent: SmsExpenseEvent | null;
  pendingSms: SmsMessage | null;
  isProcessing: boolean;
  initialize: () => Promise<void>;
  confirmPending: () => Promise<void>;
  rejectPending: () => void;
}

export const useSmsReader = (onAutoCreated?: () => void): SmsReaderState => {
  const { userId, isAuthenticated } = useAuth();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [listenerActive, setListenerActive] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<SmsExpenseEvent | null>(
    null,
  );
  const [pendingSms, setPendingSms] = useState<SmsMessage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Ref mirrors isProcessing so the SMS listener callback (started once)
  // always reads the current value without being stale.
  const isProcessingRef = useRef(false);

  const stopListenerRef = useRef<(() => void) | null>(null);
  const hasInitializedRef = useRef(false);

  /**
   * Shows a local notification informing the user that
   * an expense was auto-created from an SMS.
   */
  const showAutoCreatedNotification = useCallback(
    async (event: SmsExpenseEvent) => {
      try {
        const label = event.type === "EXPENSE" ? "Spent" : "Received";
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `💰 ${label} ${event.currency}${event.amount}`,
            body: `${event.title} — added to your transactions automatically`,
            data: { screen: "(root)", fromSms: true },
          },
          trigger: null,
        });
      } catch (error) {
        console.error("❌ Error showing auto-created notification:", error);
      }
    },
    [],
  );

  /**
   * Handles a relevant SMS: calls the AI service to classify it,
   * then either auto-creates (backend) or queues for user confirmation.
   */
  const handleSmsReceived = useCallback(
    async (sms: SmsMessage) => {
      if (!isAuthenticated || !userId || !sms.body.trim()) {
        console.log("⚠️ SMS received but user not logged in or empty body.");
        return;
      }
      console.log(`\n📬 [NEW SMS DETECTED] From: ${sms.sender}`);
      console.log(`💬 Message: "${sms.body}"`);

      // Only process finance-related SMS
      if (!isTransactionSms(sms.body)) {
        console.log(
          `⏩ [NON-FINANCIAL] Ignored (contains no banking/transaction keywords).`,
        );
        return;
      }
      console.log(
        `💳 [FINANCIAL DETECTED] Matched transaction keywords! Sending to AI classifier...`,
      );
      // Prevent duplicate simultaneous processing
      if (isProcessingRef.current) {
        console.log(
          "⏳ Already processing an SMS, skipping duplicate trigger...",
        );
        return;
      }

      isProcessingRef.current = true;
      setIsProcessing(true);

      try {
        const result = await classifySms(sms.body, userId!);
        console.log(
          `🤖 [AI Result]: label=${result.label}, confidence=${result.confidence.toFixed(
            2,
          )}, autoCreated=${result.autoCreated}`,
        );

        if (result.label === "irrelevant" || !result.event) {
          console.log("❌ SMS classified as irrelevant by Gemini, ignoring.");
          return;
        }

        if (result.autoCreated) {
          // Backend already created the expense via Kafka
          await showAutoCreatedNotification(result.event);
          onAutoCreated?.();
        } else {
          // Low confidence — ask the user to confirm
          setPendingEvent(result.event);
          setPendingSms(sms);
        }
      } catch (error) {
        console.error("❌ Error in SMS processing:", error);
      } finally {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }
    },
    [isAuthenticated, userId, showAutoCreatedNotification, onAutoCreated],
  );

  /**
   * Initializes the SMS reader: checks/requests permission,
   * then starts the foreground listener.
   */
  const initialize = useCallback(async () => {
    if (Platform.OS !== "android") {
      console.warn("⚠️ SMS reading is only supported on Android");
      return;
    }

    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Check & request permission
    const perm = await checkSmsPermission();
    let granted = perm.hasReadSmsPermission && perm.hasReceiveSmsPermission;

    if (!granted) {
      granted = await requestSmsPermission();
    }

    setPermissionGranted(granted);

    if (!granted) {
      console.warn("❌ SMS permission not granted — SMS feature disabled");
      return;
    }

    // Start listening
    const stop = startSmsListener(handleSmsReceived);
    if (stop) {
      stopListenerRef.current = stop;
      setListenerActive(true);
      console.log("✅ SMS listener started");
    }
  }, [handleSmsReceived]);

  /**
   * User confirmed the pending AI-classified transaction.
   */
  const confirmPending = useCallback(async () => {
    if (!pendingEvent) return;

    setIsProcessing(true);
    try {
      // If the backend didn't auto-create it, we create it here via the
      // existing expense API through the standard transaction service.
      // The pendingEvent already has all fields in the ExpenseDto shape.

      // Defer to the listener consumer (the UI) to call createTransaction —
      // this hook just exposes the pending event. The consumer passes the event
      // to the modal + transaction context.
      console.log("✅ User confirmed pending transaction:", pendingEvent.title);
    } catch (error) {
      console.error("❌ Error confirming pending transaction:", error);
    } finally {
      // ✅ Clear pending state so the modal closes after confirmation.
      setPendingEvent(null);
      setPendingSms(null);
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [pendingEvent]);

  /**
   * User rejected/dismissed the pending transaction.
   */
  const rejectPending = useCallback(() => {
    setPendingEvent(null);
    setPendingSms(null);
    console.log("🚫 User rejected pending SMS transaction");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListenerRef.current?.();
    };
  }, []);

  return {
    permissionGranted,
    listenerActive,
    pendingEvent,
    pendingSms,
    isProcessing,
    initialize,
    confirmPending,
    rejectPending,
  };
};

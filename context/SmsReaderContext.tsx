// context/SmsReaderContext.tsx
import SmsTransactionModal from "@/components/SmsTransactionModal";
import { Transaction } from "@/constants/types";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { useSmsReader } from "@/hooks/useSmsReader";
import { createContext, useCallback, useContext, useEffect } from "react";
import { Platform } from "react-native";

interface SmsReaderContextType {
  permissionGranted: boolean;
  listenerActive: boolean;
  isProcessing: boolean;
}

const SmsReaderContext = createContext<SmsReaderContextType | undefined>(
  undefined,
);

export const SmsReaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, userId } = useAuth();
  const { createTransaction, refresh } = useTransactions();

  const handleAutoCreated = useCallback(() => {
    setTimeout(() => {
      refresh().catch((err) =>
        console.log("Refresh after SMS auto-create error: ", err),
      );
    }, 2500);
  }, [refresh]);

  const {
    permissionGranted,
    listenerActive,
    pendingEvent,
    isProcessing,
    initialize,
    confirmPending,
    rejectPending,
  } = useSmsReader(handleAutoCreated);

  // Initialize SMS listener once user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId && Platform.OS === "android") {
      initialize();
    }
  }, [isAuthenticated, userId, initialize]);

  /**
   * Called when the user confirms the AI-classified transaction in the modal.
   * Creates it via the standard transaction service, then dismisses.
   */
  const handleConfirm = useCallback(
    async (payload: Transaction) => {
      try {
        await createTransaction(payload);
        await confirmPending();
      } catch (error) {
        console.error("❌ Error creating transaction from SMS:", error);
      }
    },
    [createTransaction, confirmPending],
  );

  const handleClose = useCallback(() => {
    rejectPending();
  }, [rejectPending]);

  return (
    <SmsReaderContext.Provider
      value={{
        permissionGranted,
        listenerActive,
        isProcessing,
      }}
    >
      {children}

      {/* Confirmation modal for low-confidence AI classifications */}
      <SmsTransactionModal
        visible={!!pendingEvent}
        event={pendingEvent}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </SmsReaderContext.Provider>
  );
};

export const useSmsReaderContext = () => {
  const context = useContext(SmsReaderContext);
  if (!context) {
    throw new Error(
      "useSmsReaderContext must be used within a SmsReaderProvider",
    );
  }
  return context;
};

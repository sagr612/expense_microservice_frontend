import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  getTransactions as getTransactionsRequest,
  updateTransaction as updateTransactionRequest,
} from "@/app/services/transactionService";
import { Transaction } from "@/constants/types";
import { useAuth } from "@/context/AuthContext";
import { createContext, useContext, useEffect, useState } from "react";

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTransaction: (payload: Transaction) => Promise<void>;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  isNegative: boolean;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, payload: Transaction) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  useEffect(() => {
    if (userId) {
      loadTransactions(userId);
    }
  }, [userId]);
  const loadTransactions = async (userId_: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getTransactionsRequest(userId_);
      setTransactions(data.content);
    } catch (err: any) {
      console.error("Error loading transactions", err);
      setError(err?.message ?? "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (payload: Transaction) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!userId) {
        return;
      }
      const created = await createTransactionRequest(payload, userId!);
      setTransactions((prev) => [created, ...prev]);
    } catch (err: any) {
      console.error("Error creating transaction", err);
      setError(err?.message ?? "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const isNegative = balance < 0;

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      setIsLoading(true);
      if (!userId) {
        return;
      }
      await deleteTransactionRequest(userId!, id);
      setTransactions((prev) => prev.filter((t) => t.externalId !== id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete transaction");
      console.error("Error deleting transaction with id", id, err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id: string, payload: Transaction) => {
    try {
      setError(null);
      setIsLoading(true);
      if (!userId) {
        return;
      }
      console.log("Updating transaction with id", id, " and payload ", payload);
      const updated = await updateTransactionRequest(payload, userId!);
      setTransactions((prev) =>
        prev.map((t) => (t.externalId === id ? updated : t)),
      );
    } catch (err: any) {
      setError(err?.message ?? "Failed to update transaction");
      console.error("Error updating transaction with id", id, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        refresh: () => loadTransactions(userId!),
        createTransaction: handleCreateTransaction,
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        isNegative,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};

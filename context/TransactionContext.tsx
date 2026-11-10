import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  getSummary,
  getTransactions as getTransactionsRequest,
  updateTransaction as updateTransactionRequest,
} from "@/app/services/transactionService";
import { Transaction } from "@/constants/types";
import { useAuth } from "@/context/AuthContext";
import { Summary } from "@/interfaces/UserTypes";
import { createContext, useContext, useEffect, useState } from "react";

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  createTransaction: (payload: Transaction) => Promise<void>;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  isNegative: boolean;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, payload: Transaction) => Promise<void>;
  summary: Summary | null;
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
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const { userId } = useAuth();
  useEffect(() => {
    if (userId) {
      loadTransactions(userId);
    } else {
      setTransactions([]);
      setSummary(null);
      setPage(0);
      setHasMore(true);
    }
  }, [userId]);

  const loadTransactions = async (userId_: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getTransactionsRequest(userId_, 0, 20);
      const summaryData = await getSummary();
      setTransactions(data.content ?? []);
      setSummary(summaryData);
      setPage(0)
      setHasMore(!data.last && (data.content?.length ?? 0) === 20)
    } catch (err: any) {
      console.error("Error loading transactions", err);
      setError(err?.message ?? "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore || !userId) return
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await getTransactionsRequest(userId, nextPage, 20)
      const newItems = data.content ?? []
      if (newItems.length > 0) {
        setTransactions((prev) => [...prev, ...newItems])
        setPage(nextPage)
      }
      setHasMore(!data.last && newItems.length === 20)
    } catch (error) {
      console.error("Error loading more transactions", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleCreateTransaction = async (payload: Transaction) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!userId) {
        return;
      }
      const created = await createTransactionRequest(payload, userId!);
      setTransactions((prev) => [created, ...prev]);
      await refreshSummary();
    } catch (err: any) {
      console.error("Error creating transaction", err);
      setError(err?.message ?? "Failed to create transaction");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      setIsLoading(true);
      if (!userId) {
        return;
      }
      await deleteTransactionRequest(userId!, id);
      setTransactions((prev) => prev.filter((t) => t.externalId !== id));
      await refreshSummary();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete transaction");
      console.error("Error deleting transaction with id", id, err);
      throw err;
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
      await refreshSummary();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update transaction");
      console.error("Error updating transaction with id", id, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSummary = async () => {
    try {
      const summaryData = await getSummary();
      setSummary(summaryData);
    } catch (err: any) {
      console.error("Error refreshing summary", err);
    }
  };
  const totalIncome = summary?.income ?? 0;
  const totalExpenses = summary?.expenditure ?? 0;
  const balance = summary?.balance ?? 0;
  const isNegative = balance < 0;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        isLoadingMore,
        hasMore,
        error,
        refresh: () => (userId ? loadTransactions(userId) : Promise.resolve()),
        loadMore,
        createTransaction: handleCreateTransaction,
        totalIncome,
        totalExpenses,
        balance,
        isNegative,
        deleteTransaction,
        updateTransaction,
        summary,
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

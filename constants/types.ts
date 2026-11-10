import Icon from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";

export type TransactionType = "INCOME" | "EXPENSE";

export type Category =
  | "FOOD"
  | "ENTERTAINMENT"
  | "TRANSPORT"
  | "SHOPPING"
  | "HEALTH"
  | "BILLS"
  | "SALARY"
  | "FREELANCE"
  | "INVESTMENT"
  | "GIFT"
  | "OTHERS";

export interface Transaction {
  externalId?: string;
  userId?: string;
  amount: number;
  currency: string;
  type: TransactionType;
  category: Category;
  createdAt?: string;
  title: string;
  note?: string;
  transactionDate: string;
}

type Categorytype = {
  id: Category;
  name: string;
  icon: ComponentProps<typeof Icon>["name"];
};
export const categories: Record<TransactionType, Categorytype[]> = {
  EXPENSE: [
    { id: "FOOD", name: "Food & Dining", icon: "restaurant" },
    { id: "TRANSPORT", name: "Transport", icon: "car" },
    { id: "SHOPPING", name: "Shopping", icon: "cart" },
    { id: "BILLS", name: "Bills", icon: "receipt" },
    { id: "ENTERTAINMENT", name: "Entertainment", icon: "game-controller" },
    { id: "HEALTH", name: "Health", icon: "fitness" },
    { id: "OTHERS", name: "Others", icon: "ellipsis-horizontal" },
  ],
  INCOME: [
    { id: "SALARY", name: "Salary", icon: "briefcase" },
    { id: "FREELANCE", name: "Freelance", icon: "code-slash" },
    { id: "INVESTMENT", name: "Investment", icon: "trending-up" },
    { id: "GIFT", name: "Gift", icon: "gift" },
    { id: "OTHERS", name: "Others", icon: "ellipsis-horizontal" },
  ],
};

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean
}

export const getCategoryIcon = (
  category: string,
): keyof typeof Icon.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Icon.glyphMap } = {
    FOOD: "fast-food-outline",
    TRANSPORT: "car-outline",
    SHOPPING: "bag-handle-outline",
    BILLS: "receipt-outline",
    ENTERTAINMENT: "game-controller-outline",
    HEALTH: "fitness-outline",
    SALARY: "cash-outline",
    FREELANCE: "laptop-outline",
    INVESTMENT: "trending-up-outline",
    GIFT: "gift-outline",
    OTHERS: "ellipsis-horizontal-outline",
  };
  return iconMap[category] || "wallet-outline";
};

export const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    FOOD: "#F97316",
    TRANSPORT: "#3B82F6",
    SHOPPING: "#A855F7",
    BILLS: "#EF4444",
    ENTERTAINMENT: "#EC4899",
    HEALTH: "#10B981",
    SALARY: "#10B981",
    FREELANCE: "#8B5CF6",
    INVESTMENT: "#F59E0B",
    GIFT: "#06B6D4",
    OTHERS: "#6B7280",
  };
  return colorMap[category] || "#6B7280";
};

export type NotificationType =
  | "BUDGET_WARNING"
  | "BUDGET_EXCEEDED"
  | "EXPENSE_CREATED"
  | "LARGE_EXPENSE"
  | "AI_INSIGHT"
  | "SALARY"
  | "GENERAL";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export const notificationColors: Record<NotificationType, string> = {
  BUDGET_WARNING: "#F59E0B",
  BUDGET_EXCEEDED: "#EF4444",
  EXPENSE_CREATED: "#8B5CF6",
  LARGE_EXPENSE: "#EC4899",
  AI_INSIGHT: "#3B82F6",
  SALARY: "#10B981",
  GENERAL: "#6B7280",
};

export const notificationIcons: Record<
  NotificationType,
  React.ComponentProps<typeof Icon>["name"]
> = {
  BUDGET_WARNING: "warning",
  BUDGET_EXCEEDED: "alert-circle",
  EXPENSE_CREATED: "wallet",
  LARGE_EXPENSE: "cash",
  AI_INSIGHT: "sparkles",
  SALARY: "trending-up",
  GENERAL: "notifications",
};

export interface BudgetStatus {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export interface BudgetDto {
  category: string;
  amount: number;
  month: number;
  year: number;
}

export type CategoryType =
  | "FOOD"
  | "TRANSPORT"
  | "SHOPPING"
  | "BILLS"
  | "ENTERTAINMENT"
  | "HEALTH"
  | "SALARY"
  | "FREELANCE"
  | "INVESTMENT"
  | "GIFT"
  | "OTHERS";

export interface CategoryAnalytics {
  analytics: Record<string, number>;
}

export interface MonthlyAnalytics {
  year: number;
  month: number;
  totalAmount: number;
}

export interface CategoryAnalyticsResponse {
  expenses: Partial<Record<CategoryType, number>>;
  income: Partial<Record<CategoryType, number>>;
}

export interface MonthlyAnalyticsDto {
  year: number;
  month: number;
  totalExpense: number;
  totalIncome: number;
}

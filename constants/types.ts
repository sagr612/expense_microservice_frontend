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

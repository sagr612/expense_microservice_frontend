import {
  getCategoryColor,
  getCategoryIcon,
  Transaction,
} from "@/constants/types";
import { useCurrency } from "@/hooks/useCurrency";
import { formatDate } from "@/utils/utility";
import Icon from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TransactionItemProps {
  item: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
  const iconColor = getCategoryColor(item.category);
  const isExpense = item.type === "EXPENSE";
  const router = useRouter();
  const { currency } = useCurrency();

  const handleSubmit = () => {
    router.push({
      pathname: "/transactions/[id]",
      params: { id: item.externalId! },
    });
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
      style={{ elevation: 2 }}
      onPress={handleSubmit}
    >
      {/* Icon */}
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Icon
          name={getCategoryIcon(item.category)}
          size={24}
          color={iconColor}
        />
      </View>

      {/* Transaction Details */}
      <View className="flex-1">
        <Text className="font-poppins-bold text-gray-800 text-base mb-1">
          {item.title}
        </Text>
        <Text className="font-poppins text-gray-500 text-xs">
          {formatDate(item.createdAt!)}
        </Text>
      </View>

      {/* Amount */}
      <Text
        className={`font-poppins-bold text-base ${
          isExpense ? "text-red-500" : "text-green-500"
        }`}
      >
        {currency.symbol}
        <Text> </Text>
        {Math.abs(item.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionItem;

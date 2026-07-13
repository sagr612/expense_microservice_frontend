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
  const router = useRouter();
  const { currency } = useCurrency();

  const color = getCategoryColor(item.category);
  const isExpense = item.type === "EXPENSE";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/transactions/[id]",
          params: {
            id: item.externalId!,
          },
        })
      }
      className="flex-row bg-white rounded-[24px] overflow-hidden"
      style={{
        shadowColor: "#1E1B2E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {/* Category accent bar — signature touch, ties the card to its category color */}
      <View style={{ width: 4, backgroundColor: color }} />

      <View className="flex-1 flex-row items-center p-4">
        {/* Icon */}
        <View
          className="w-13 h-13 rounded-full items-center justify-center"
          style={{
            width: 52,
            height: 52,
            backgroundColor: `${color}18`,
          }}
        >
          <Icon name={getCategoryIcon(item.category)} size={24} color={color} />
        </View>

        {/* Details */}
        <View className="flex-1 ml-3.5">
          <Text
            numberOfLines={1}
            className="text-base font-poppins-semibold text-gray-900"
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1.5">
            <View
              className="rounded-full px-2.5 py-0.5"
              style={{ backgroundColor: `${color}15` }}
            >
              <Text
                style={{ color }}
                className="text-[11px] font-poppins-semibold"
              >
                {item.category}
              </Text>
            </View>

            <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />

            <Text className="text-gray-400 text-xs font-poppins">
              {formatDate(item.createdAt!)}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <View className="items-end ml-2">
          <Text
            className={`text-base font-poppins-bold ${
              isExpense ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {isExpense ? "-" : "+"}
            {currency.symbol}
            {Math.abs(item.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <View className="flex-row items-center mt-1">
            <Text
              className={`text-[10px] tracking-wide font-poppins-semibold ${
                isExpense ? "text-red-400" : "text-emerald-500"
              }`}
            >
              {item.type}
            </Text>
            <Icon
              name="chevron-forward"
              size={13}
              color="#C4C4CC"
              style={{ marginLeft: 3 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

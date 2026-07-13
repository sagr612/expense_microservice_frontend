import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import {
  getCategoryAnalytics,
  getMonthlyAnalytics,
} from "../services/transactionService";

const screenWidth = Dimensions.get("window").width;

type PieItem = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type MonthlyItem = {
  year: number;
  month: number;
  totalAmount: number;
};

const cardShadow = {
  shadowColor: "#1E1B2E",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.05,
  shadowRadius: 14,
  elevation: 3,
};

export default function AnalyticsScreen() {
  const { userId } = useAuth();
  const { currency } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<PieItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    if (userId) {
      loadAnalytics();
    }
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const category = await getCategoryAnalytics(userId!);
      const monthly = await getMonthlyAnalytics(userId!);

      const colors = [
        "#8B5CF6",
        "#EC4899",
        "#F97316",
        "#10B981",
        "#3B82F6",
        "#EF4444",
      ];

      const pieData: PieItem[] = Object.entries(category.analytics).map(
        ([name, amount], index) => ({
          name,
          amount: Number(amount),
          color: colors[index % colors.length],
          legendFontColor: "#374151",
          legendFontSize: 12,
        }),
      );

      pieData.sort((a, b) => b.amount - a.amount);
      setCategoryData(pieData);
      setMonthlyData(monthly);
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = categoryData.reduce((sum, item) => sum + item.amount, 0);

  const maxAmount =
    categoryData.length > 0
      ? Math.max(...categoryData.map((item) => item.amount))
      : 1;

  const formatAmount = (value: number) =>
    `${currency.symbol}${value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F7F7FB]"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-20 px-6"
        >
          <Text className="text-white/60 text-[13px] font-poppins">
            Overview
          </Text>
          <Text className="text-white text-[28px] font-poppins-bold mt-0.5">
            Analytics
          </Text>
          <Text className="text-white/70 text-[14px] mt-1 font-poppins">
            Spending insights & trends
          </Text>
        </LinearGradient>
      </View>

      {/* Total Expense Card */}
      <View className="px-6 -mt-12">
        <View className="bg-white rounded-[28px] p-6" style={cardShadow}>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide">
              Total Expenses
            </Text>
            <View className="w-9 h-9 rounded-full bg-violet-50 items-center justify-center">
              <Icon name="stats-chart" size={16} color="#8B5CF6" />
            </View>
          </View>

          <Text className="text-4xl font-poppins-bold text-gray-900 mt-2.5">
            {formatAmount(totalExpense)}
          </Text>

          <View className="h-1.5 w-14 bg-violet-500 rounded-full mt-4" />
        </View>
      </View>

      {/* Category Analytics */}
      <View
        className="bg-white mx-6 mt-6 rounded-[28px] p-6"
        style={cardShadow}
      >
        <Text className="text-lg font-poppins-bold text-gray-900 mb-5">
          Expenses by Category
        </Text>

        {categoryData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <View className="items-center -mx-2">
              <PieChart
                data={categoryData}
                width={screenWidth - 48}
                height={220}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
              />
            </View>

            {/* Custom Legend */}
            <View className="mt-5" style={{ gap: 8 }}>
              {categoryData.map((item) => (
                <View
                  key={item.name}
                  className="flex-row items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      className="ml-3 text-[14px] font-poppins-medium text-gray-700 flex-1"
                    >
                      {item.name}
                    </Text>
                  </View>

                  <Text className="font-poppins-semibold text-gray-900 text-[14px] ml-2">
                    {formatAmount(item.amount)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Progress Bars */}
            <View className="mt-7">
              <Text className="text-sm font-poppins-semibold text-gray-900 mb-4">
                Breakdown
              </Text>
              {categoryData.map((item) => (
                <View key={item.name} className="mb-5">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-poppins-medium text-gray-500 text-[13px]">
                      {item.name}
                    </Text>
                    <Text className="font-poppins-semibold text-gray-900 text-[13px]">
                      {((item.amount / totalExpense) * 100).toFixed(1)}%
                    </Text>
                  </View>

                  <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      style={{
                        width: `${(item.amount / maxAmount) * 100}%`,
                        backgroundColor: item.color,
                        height: "100%",
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className="items-center py-10">
            <View className="w-20 h-20 rounded-full bg-violet-50 items-center justify-center">
              <Icon name="pie-chart-outline" size={36} color="#A855F7" />
            </View>
            <Text className="text-gray-400 text-[14px] font-poppins mt-4 text-center px-6">
              No category data available yet.
            </Text>
          </View>
        )}
      </View>

      {/* Monthly Trend */}
      <View
        className="bg-white mx-6 mt-6 rounded-[28px] p-6"
        style={cardShadow}
      >
        <Text className="text-lg font-poppins-bold text-gray-900 mb-5">
          Monthly Spending Trend
        </Text>

        {monthlyData.length > 1 ? (
          <LineChart
            data={{
              labels: monthlyData.map((m) => `${m.month}/${m.year}`),
              datasets: [
                {
                  data: monthlyData.map((m) => m.totalAmount),
                },
              ],
            }}
            width={screenWidth - 48}
            height={240}
            bezier
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              labelColor: () => "#9CA3AF",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#fff",
              },
              propsForBackgroundLines: {
                stroke: "#F0EFF5",
              },
            }}
            style={{
              borderRadius: 16,
              marginVertical: 4,
              marginLeft: -16,
            }}
          />
        ) : (
          <View className="items-center py-10 bg-gray-50 rounded-2xl">
            <View className="w-20 h-20 rounded-full bg-violet-50 items-center justify-center">
              <Icon name="trending-up-outline" size={36} color="#A855F7" />
            </View>
            <Text className="text-gray-400 text-center text-[14px] font-poppins mt-4 px-6">
              Add expenses across multiple months to see your spending trend.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

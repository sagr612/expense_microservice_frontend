import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { LineChart, PieChart } from "react-native-chart-kit";
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

export default function AnalyticsScreen() {
  const { userId } = useAuth();

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
      console.log(JSON.stringify(pieData, null, 2));
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-6 pt-10 pb-8 bg-white">
        <Text className="text-4xl font-bold text-gray-900 tracking-tight">
          Analytics
        </Text>
        <Text className="text-gray-500 mt-1 text-lg">
          Spending insights & trends
        </Text>
      </View>

      {/* Total Expense Card */}
      <View className="mx-4 -mt-4 bg-white rounded-3xl p-8 shadow-xl shadow-purple-500/10 border border-gray-100">
        <Text className="text-gray-500 text-sm font-medium tracking-widest">
          TOTAL EXPENSES
        </Text>
        <Text className="text-5xl font-bold text-gray-900 mt-3">
          ₹{totalExpense.toLocaleString()}
        </Text>
        <View className="h-1.5 w-16 bg-purple-500 rounded-full mt-4" />
      </View>

      {/* Category Analytics */}
      <View className="bg-white mx-4 mt-8 rounded-3xl p-6 shadow-sm border border-gray-100">
        <Text className="text-2xl font-semibold text-gray-900 mb-6">
          Expenses by Category
        </Text>

        {categoryData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <View className="items-center -mx-2">
              <PieChart
                data={categoryData}
                width={screenWidth - 48}
                height={240}
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
            <View className="mt-6 space-y-4">
              {categoryData.map((item) => (
                <View
                  key={item.name}
                  className="flex-row items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text className="ml-3 text-base font-medium text-gray-800">
                      {item.name}
                    </Text>
                  </View>

                  <Text className="font-semibold text-gray-900 text-base">
                    ₹{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Progress Bars */}
            <View className="mt-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Breakdown
              </Text>
              {categoryData.map((item) => (
                <View key={item.name} className="mb-6">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium text-gray-700">
                      {item.name}
                    </Text>
                    <Text className="font-semibold text-gray-900">
                      {((item.amount / totalExpense) * 100).toFixed(1)}%
                    </Text>
                  </View>

                  <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
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
          <Text className="text-gray-500 py-12 text-center">
            No category data available yet.
          </Text>
        )}
      </View>

      {/* Monthly Trend */}
      <View className="bg-white mx-4 mt-8 rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <Text className="text-2xl font-semibold text-gray-900 mb-6">
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
            height={260}
            bezier
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              labelColor: () => "#6B7280",
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#fff",
              },
              propsForBackgroundLines: {
                stroke: "#E5E7EB",
              },
            }}
            style={{
              borderRadius: 16,
              marginVertical: 8,
            }}
          />
        ) : (
          <View className="py-16 items-center bg-gray-50 rounded-2xl">
            <Text className="text-gray-400 text-center text-base px-6">
              Add expenses across multiple months{"\n"}to see your spending
              trend
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

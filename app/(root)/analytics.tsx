import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import {
  getCategoryAnalytics,
  getMonthlyAnalytics,
} from "../services/transactionService";
import {
  CategoryAnalyticsResponse,
  CategoryType,
  MonthlyAnalyticsDto,
  getCategoryColor,
  getCategoryIcon,
} from "@/constants/types";

const screenWidth = Dimensions.get("window").width;

type CategoryItem = {
  name: string;
  category: CategoryType;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const cardShadow = {
  shadowColor: "#1E1B2E",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 3,
};

export default function AnalyticsScreen() {
  const { userId } = useAuth();
  const { currency } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [rawCategoryData, setRawCategoryData] =
    useState<CategoryAnalyticsResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalyticsDto[]>([]);

  useEffect(() => {
    if (userId) {
      loadAnalytics();
    }
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [category, monthly] = await Promise.all([
        getCategoryAnalytics(userId!),
        getMonthlyAnalytics(userId!),
      ]);

      setRawCategoryData(category);
      setMonthlyData(monthly || []);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isExpense = activeTab === "EXPENSE";

  // Category data mapping with safe color & icon fallbacks
  const categoryData: CategoryItem[] = useMemo(() => {
    const dataMap = isExpense
      ? rawCategoryData?.expenses || {}
      : rawCategoryData?.income || {};

    return Object.entries(dataMap)
      .map(([name, amount]) => {
        const cat = name as CategoryType;
        return {
          name,
          category: cat,
          amount: Number(amount) || 0,
          color: getCategoryColor(cat),
          legendFontColor: "#4B5563",
          legendFontSize: 12,
        };
      })
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [rawCategoryData, isExpense]);

  const totalAmount = useMemo(
    () => categoryData.reduce((sum, item) => sum + item.amount, 0),
    [categoryData],
  );

  const maxAmount = useMemo(
    () =>
      categoryData.length > 0
        ? Math.max(...categoryData.map((i) => i.amount))
        : 1,
    [categoryData],
  );

  const formatAmount = (value: number) =>
    `${currency.symbol}${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  // Monthly line chart points with defensive guards
  const lineChartData = useMemo(() => {
    if (!monthlyData || monthlyData.length < 2) return null;

    const values = monthlyData.map((m) =>
      Number(isExpense ? (m.totalExpense ?? 0) : (m.totalIncome ?? 0)),
    );

    // If all monthly data points are 0, LineChart from react-native-chart-kit would divide by zero
    const hasNonZero = values.some((v) => v > 0);
    if (!hasNonZero) return null;

    const labels = monthlyData.map(
      (m) => `${m.month}/${String(m.year).slice(-2)}`,
    );

    return {
      labels,
      datasets: [{ data: values }],
    };
  }, [monthlyData, isExpense]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F7F7FB]"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#6366F1", "#8B5CF6", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-16 pb-24 px-6"
        >
          <Text className="text-white/70 text-[13px] font-poppins">
            Financial Intelligence
          </Text>
          <Text className="text-white text-[30px] font-poppins-bold mt-0.5">
            Analytics
          </Text>
          <Text className="text-white/80 text-[14px] mt-1 font-poppins">
            Comprehensive breakdown of your money flow
          </Text>

          {/* Clean Segmented Tab Switcher without NativeWind upgrade warnings */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setActiveTab("EXPENSE")}
              style={[
                styles.tabButton,
                isExpense ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Icon
                name="arrow-down-circle"
                size={18}
                color={isExpense ? "#EC4899" : "rgba(255,255,255,0.7)"}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: isExpense ? "#EC4899" : "rgba(255,255,255,0.85)" },
                ]}
              >
                Expenses
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setActiveTab("INCOME")}
              style={[
                styles.tabButton,
                !isExpense ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Icon
                name="arrow-up-circle"
                size={18}
                color={!isExpense ? "#8B5CF6" : "rgba(255,255,255,0.7)"}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: !isExpense ? "#8B5CF6" : "rgba(255,255,255,0.85)" },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Hero Stat Card */}
      <View className="px-6 -mt-12">
        <View className="bg-white rounded-[28px] p-6" style={cardShadow}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                style={{ backgroundColor: isExpense ? "#FDF2F8" : "#F5F3FF" }}
              >
                <Icon
                  name={isExpense ? "trending-down" : "trending-up"}
                  size={20}
                  color={isExpense ? "#EC4899" : "#8B5CF6"}
                />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wider">
                  {isExpense ? "Total Expenses" : "Total Income"}
                </Text>
                <Text className="text-3xl font-poppins-bold text-gray-900 mt-1">
                  {formatAmount(totalAmount)}
                </Text>
              </View>
            </View>

            <View
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: isExpense ? "#FEE2E2" : "#DCFCE7" }}
            >
              <Text
                className="text-xs font-poppins-semibold"
                style={{ color: isExpense ? "#EF4444" : "#16A34A" }}
              >
                {categoryData.length}{" "}
                {categoryData.length === 1 ? "Category" : "Categories"}
              </Text>
            </View>
          </View>

          <View
            className="h-1.5 w-16 rounded-full mt-4"
            style={{ backgroundColor: isExpense ? "#EC4899" : "#8B5CF6" }}
          />
        </View>
      </View>

      {/* Category Breakdown & Pie Chart */}
      <View
        className="bg-white mx-6 mt-6 rounded-[28px] p-6"
        style={cardShadow}
      >
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-lg font-poppins-bold text-gray-900">
            {isExpense ? "Expenses by Category" : "Income by Category"}
          </Text>
          <Text className="text-xs font-poppins-medium text-gray-400">
            Share
          </Text>
        </View>

        {categoryData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <View className="items-center -mx-2">
              <PieChart
                data={categoryData}
                width={screenWidth - 48}
                height={210}
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

            {/* Category List */}
            <View className="mt-5" style={{ gap: 10 }}>
              {categoryData.map((item) => {
                const percentage =
                  totalAmount > 0
                    ? ((item.amount / totalAmount) * 100).toFixed(1)
                    : "0.0";
                const barWidth =
                  maxAmount > 0 ? `${(item.amount / maxAmount) * 100}%` : "0%";

                return (
                  <View
                    key={item.name}
                    className="bg-gray-50/80 rounded-2xl p-3.5 border border-gray-100/80"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon
                            name={getCategoryIcon(item.name)}
                            size={18}
                            color={item.color}
                          />
                        </View>
                        <View className="flex-1 mr-2">
                          <Text
                            numberOfLines={1}
                            className="font-poppins-semibold text-gray-800 text-[14px]"
                          >
                            {item.name}
                          </Text>
                          <Text className="text-xs font-poppins text-gray-400">
                            {percentage}% of total
                          </Text>
                        </View>
                      </View>

                      <Text className="font-poppins-bold text-gray-900 text-[15px]">
                        {formatAmount(item.amount)}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View className="h-2 bg-gray-200/60 rounded-full overflow-hidden mt-3">
                      <View
                        style={{
                          width: barWidth,
                          backgroundColor: item.color,
                          height: "100%",
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <View className="items-center py-10">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: isExpense ? "#FDF2F8" : "#F5F3FF" }}
            >
              <Icon
                name="pie-chart-outline"
                size={32}
                color={isExpense ? "#EC4899" : "#8B5CF6"}
              />
            </View>
            <Text className="text-gray-400 text-[14px] font-poppins mt-3 text-center">
              No {isExpense ? "expense" : "income"} data recorded yet.
            </Text>
          </View>
        )}
      </View>

      {/* Monthly Trend Line Chart */}
      <View
        className="bg-white mx-6 mt-6 rounded-[28px] p-6"
        style={cardShadow}
      >
        <Text className="text-lg font-poppins-bold text-gray-900 mb-5">
          {isExpense ? "Monthly Expense Trend" : "Monthly Income Trend"}
        </Text>

        {lineChartData ? (
          <LineChart
            data={lineChartData}
            width={screenWidth - 48}
            height={220}
            bezier
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                isExpense
                  ? `rgba(236, 72, 153, ${opacity})`
                  : `rgba(139, 92, 246, ${opacity})`,
              labelColor: () => "#9CA3AF",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#ffffff",
              },
              propsForBackgroundLines: {
                stroke: "#F3F4F6",
              },
            }}
            style={{
              borderRadius: 16,
              marginVertical: 4,
              marginLeft: -16,
            }}
          />
        ) : (
          <View className="items-center py-10 bg-gray-50/60 rounded-2xl border border-gray-100">
            <View className="w-14 h-14 rounded-full bg-violet-50 items-center justify-center">
              <Icon name="trending-up-outline" size={28} color="#8B5CF6" />
            </View>
            <Text className="text-gray-400 text-center text-[13px] font-poppins mt-3 px-6">
              Add transactions across multiple months to reveal your monthly
              trend.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 4,
    borderRadius: 16,
    marginTop: 18,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonInactive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
});

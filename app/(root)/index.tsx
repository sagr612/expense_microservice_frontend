import TransactionItem from "@/components/TransactionItem";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useCurrency } from "@/hooks/useCurrency";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { user: authUser, userId } = useAuth();
  const { transactions, totalIncome, totalExpenses, balance, isNegative } =
    useTransactions();

  const { user, getUser } = useUser();
  const { currency } = useCurrency();

  // Hooks must run unconditionally — this was previously after the
  // early-return below, which breaks the Rules of Hooks.
  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  if (!authUser || !userId) {
    return <Redirect href="/(auth)/login" />;
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 👋";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  })();

  return (
    <View className="flex-1 bg-[#F7F7FB]">
      {/* Hero Header */}
      <LinearGradient
        colors={["#7C3AED", "#A855F7", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-24 px-6 rounded-b-[36px]"
      >
        {/* Top Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image
              source={{
                uri: user?.profile_pic ?? "https://i.pravatar.cc/300?img=12",
              }}
              className="w-14 h-14 rounded-full border-2 border-white/80"
            />

            <View className="ml-3.5 flex-1">
              <Text className="text-white/60 text-[13px] font-poppins">
                {greeting}
              </Text>
              <Text
                numberOfLines={1}
                className="text-white text-2xl font-poppins-bold mt-0.5"
              >
                {authUser}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push("/(root)/settings")}>
            <View className="w-11 h-11 rounded-full bg-white/15 items-center justify-center">
              <Icon name="settings-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View
          className="bg-white rounded-[28px] mt-8 p-6"
          style={{
            shadowColor: "#1E1B2E",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-[13px] font-poppins">
              Available Balance
            </Text>
            <View className="w-8 h-8 rounded-full bg-violet-50 items-center justify-center">
              <Icon name="wallet-outline" size={16} color="#8B5CF6" />
            </View>
          </View>

          <Text
            numberOfLines={1}
            className={`mt-2 text-4xl font-poppins-bold ${
              isNegative ? "text-red-500" : "text-gray-900"
            }`}
          >
            {currency.symbol}
            {Math.abs(balance).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <View className="h-px bg-gray-100 my-5" />

          <View className="flex-row justify-between">
            {/* Income */}
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                <Icon name="arrow-down" color="#16A34A" size={18} />
              </View>
              <View className="ml-2.5">
                <Text className="text-gray-400 text-[11px] font-poppins">
                  Income
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-poppins-bold text-emerald-600 text-[15px] mt-0.5"
                >
                  {currency.symbol}
                  {totalIncome.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>

            <View className="w-px bg-gray-100 mx-1" />

            {/* Expense */}
            <View className="flex-row items-center flex-1 ml-2">
              <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center">
                <Icon name="arrow-up" color="#DC2626" size={18} />
              </View>
              <View className="ml-2.5">
                <Text className="text-gray-400 text-[11px] font-poppins">
                  Expenses
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-poppins-bold text-red-500 text-[15px] mt-0.5"
                >
                  {currency.symbol}
                  {totalExpenses.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mt-5">
          <View className="bg-white/12 rounded-2xl px-4 py-3 flex-1 mr-2">
            <Text className="text-white/55 text-[11px] font-poppins">
              Transactions
            </Text>
            <Text className="text-white font-poppins-bold text-lg mt-1">
              {transactions.length}
            </Text>
          </View>

          <View className="bg-white/12 rounded-2xl px-4 py-3 flex-1 mx-1">
            <Text className="text-white/55 text-[11px] font-poppins">
              This Month
            </Text>
            <Text className="text-white font-poppins-bold text-lg mt-1">
              {new Date().toLocaleString("default", { month: "short" })}
            </Text>
          </View>

          <View className="bg-white/12 rounded-2xl px-4 py-3 flex-1 ml-2">
            <Text className="text-white/55 text-[11px] font-poppins">
              Status
            </Text>
            <Text
              className={`font-poppins-bold text-lg mt-1 ${
                isNegative ? "text-red-200" : "text-emerald-200"
              }`}
            >
              {isNegative ? "Loss" : "Healthy"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Recent Activity */}
      <View className="flex-1 px-6 -mt-10">
        <View
          className="flex-1 bg-white rounded-[28px] p-6"
          style={{
            shadowColor: "#1E1B2E",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.05,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-xl font-poppins-bold text-gray-900">
                Recent Activity
              </Text>
              <Text className="text-gray-400 text-[13px] mt-0.5 font-poppins">
                Your latest transactions
              </Text>
            </View>

            {transactions.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push("/(root)/all-transactions")}
              >
                <View className="flex-row items-center bg-violet-50 rounded-full px-3.5 py-2">
                  <Text className="text-violet-600 font-poppins-semibold text-[13px]">
                    See all
                  </Text>
                  <Icon
                    name="chevron-forward"
                    size={14}
                    color="#8B5CF6"
                    style={{ marginLeft: 2 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {transactions.length === 0 ? (
            <View className="flex-1 items-center justify-center py-6">
              <View className="w-24 h-24 rounded-full bg-violet-50 items-center justify-center">
                <Icon name="wallet-outline" size={44} color="#A855F7" />
              </View>

              <Text className="text-xl font-poppins-bold mt-6 text-gray-900">
                No transactions yet
              </Text>

              <Text className="text-center text-gray-400 text-[14px] mt-2 px-6 leading-6 font-poppins">
                Start tracking your finances by adding your first income or
                expense.
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(root)/create")}
                className="mt-6"
              >
                <LinearGradient
                  colors={["#7C3AED", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-full px-6 py-3.5"
                >
                  <View className="flex-row items-center">
                    <Icon name="add-circle-outline" size={18} color="white" />
                    <Text className="text-white font-poppins-semibold text-[13px] ml-2">
                      Add Transaction
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={transactions.slice(0, 5)}
              keyExtractor={(item) => item.externalId!}
              renderItem={({ item }) => (
                <View className="mb-3">
                  <TransactionItem item={item} />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

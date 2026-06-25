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
  if (!authUser || !userId) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  return (
    <View className="bg-gray-50 flex-1">
      {/* Header */}
      <LinearGradient
        colors={["#F3F4F6", "#E5E7EB"]}
        className="pt-12 pb-6 px-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          {/* User Info */}
          <View className="flex-row items-center flex-1">
            <Image
              source={{
                uri: user?.profile_pic ?? "https://i.pravatar.cc/150?img=12",
              }}
              className="w-12 h-12 rounded-full mr-3 border-2 border-white"
            />
            <View>
              <Text className="text-gray-500 text-xs font-poppins">
                {userId}
              </Text>
              <Text className="font-poppins-bold text-gray-800 text-base">
                {authUser}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(root)/settings")}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Icon name="settings-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="rounded-xl overflow-hidden mt-4 shadow-lg">
          <LinearGradient
            colors={["#8B5CF6", "#EC4899", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <Text className="text-white/80 text-sm font-poppins mb-2">
              Total Balance
            </Text>
            <Text
              className={`text-4xl font-poppins-bold mb-6 ${isNegative ? "text-gray-100" : "text-green-400"}`}
            >
              {currency.symbol}

              {Math.abs(balance).toFixed(2)}
            </Text>

            <View className="flex-row justify-between items-center">
              {/* Income */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Icon name="arrow-down" size={18} color="#10B981" />
                </View>
                <View>
                  <Text className="text-white/70 text-xs font-poppins">
                    Income
                  </Text>
                  <Text className="text-white text-base font-poppins-bold">
                    {currency.symbol}

                    {totalIncome.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Expenses */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Icon name="arrow-up" size={18} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-white/70 text-xs font-poppins">
                    Expenses
                  </Text>
                  <Text className="text-white text-base font-poppins-bold">
                    {currency.symbol}

                    {totalExpenses.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Transactions Section */}
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-poppins-bold text-gray-800 text-lg">
            Transactions
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(root)/all-transactions")}
          >
            <Text className="text-purple-600 font-poppins text-sm">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem item={item} />}
          keyExtractor={(item) => item?.externalId!}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* <TestDeepLink /> */}
      </View>
    </View>
  );
}

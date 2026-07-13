import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import Icon from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  BudgetStatus,
  createBudget,
  getBudgetStatus,
} from "../services/transactionService";

const categoryColors: Record<string, string> = {
  FOOD: "#8B5CF6",
  TRANSPORT: "#10B981",
  HEALTH: "#F97316",
  ENTERTAINMENT: "#EC4899",
  SHOPPING: "#3B82F6",
  EDUCATION: "#F59E0B",
  OTHER: "#6B7280",
};

const categoryIcons: Record<string, React.ComponentProps<typeof Icon>["name"]> =
  {
    FOOD: "restaurant",
    TRANSPORT: "car-sport",
    HEALTH: "medical",
    ENTERTAINMENT: "film",
    SHOPPING: "cart",
    EDUCATION: "school",
    OTHER: "ellipsis-horizontal",
  };

const cardShadow = {
  shadowColor: "#1E1B2E",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.05,
  shadowRadius: 14,
  elevation: 3,
};

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const { userId } = useAuth();
  const { currency } = useCurrency();
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState("FOOD");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const formatAmount = (value: number) =>
    `${currency.symbol}${value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const handleCreateBudget = async () => {
    if (!amount) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter budget amount",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createBudget({
        category,
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
      });

      setModalVisible(false);
      setAmount("");
      setCategory("FOOD");
      setMonth((new Date().getMonth() + 1).toString());
      setYear(new Date().getFullYear().toString());

      loadBudgets();
      Toast.show({
        type: "success",
        text1: "Budget Created",
        text2: "Your budget has been created successfully",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, []),
  );

  const loadBudgets = async () => {
    try {
      const now = new Date();
      const data = await getBudgetStatus(now.getMonth() + 1, now.getFullYear());
      setBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7FB]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="rounded-b-[36px] overflow-hidden">
          <View
            className="pt-14 pb-8 px-6"
            style={{ backgroundColor: "#7C3AED" }}
          >
            <Text className="text-white/60 text-[13px] font-poppins">
              This month
            </Text>
            <Text className="text-white text-[28px] font-poppins-bold mt-0.5">
              Budgets
            </Text>
            <Text className="text-white/70 text-[14px] mt-1 font-poppins">
              Track your monthly spending goals
            </Text>
          </View>
        </View>

        {/* Budget Cards or Empty State */}
        <View className="px-5 pt-6">
          {budgets.length > 0 ? (
            budgets.map((budget) => {
              const percentage = Math.min(
                (budget.spent / budget.budget) * 100,
                100,
              );
              const exceeded = budget.spent > budget.budget;
              const remaining = Math.max(0, budget.budget - budget.spent);
              const color = categoryColors[budget.category] || "#8B5CF6";

              return (
                <View
                  key={budget.category}
                  className="bg-white rounded-[28px] p-6 mb-4"
                  style={cardShadow}
                >
                  {/* Category Header */}
                  <View className="flex-row items-center justify-between mb-5">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-11 h-11 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Icon
                          name={categoryIcons[budget.category] || "wallet"}
                          size={20}
                          color={color}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        className="font-poppins-semibold text-[17px] text-gray-900 ml-3 flex-1"
                      >
                        {budget.category}
                      </Text>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-full ${
                        exceeded ? "bg-red-50" : "bg-emerald-50"
                      }`}
                    >
                      <Text
                        className={`font-poppins-semibold text-[11px] ${
                          exceeded ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {exceeded ? "OVER BUDGET" : "ON TRACK"}
                      </Text>
                    </View>
                  </View>

                  {/* Amounts */}
                  <View className="flex-row justify-between items-end mb-4">
                    <View>
                      <Text className="text-gray-400 text-xs font-poppins">
                        Budget
                      </Text>
                      <Text className="text-2xl font-poppins-bold text-gray-900 mt-1">
                        {formatAmount(budget.budget)}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-gray-400 text-xs font-poppins">
                        Remaining
                      </Text>
                      <Text
                        className={`text-xl font-poppins-bold mt-1 ${
                          exceeded ? "text-red-500" : "text-emerald-600"
                        }`}
                      >
                        {formatAmount(remaining)}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: exceeded ? "#EF4444" : color,
                      }}
                    />
                  </View>

                  {/* Spent & Percentage */}
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-400 text-xs font-poppins">
                        Spent
                      </Text>
                      <Text className="font-poppins-semibold text-[15px] text-gray-800 mt-0.5">
                        {formatAmount(budget.spent)}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-gray-400 text-xs font-poppins">
                        Used
                      </Text>
                      <Text className="font-poppins-semibold text-[15px] text-gray-800 mt-0.5">
                        {budget.percentageUsed.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            /* Empty State */
            <View className="items-center justify-center py-16">
              <View className="w-24 h-24 rounded-full bg-violet-50 items-center justify-center mb-6">
                <Icon name="wallet-outline" size={44} color="#A855F7" />
              </View>
              <Text className="text-xl font-poppins-bold text-gray-900 mb-2">
                No budgets yet
              </Text>
              <Text className="text-gray-400 text-center text-[14px] font-poppins px-10 leading-6">
                Create your first budget to start tracking your monthly
                spending.
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.85}
                className="mt-7 flex-row items-center bg-violet-600 px-6 py-3.5 rounded-full"
              >
                <Icon name="add" size={18} color="white" />
                <Text className="text-white font-poppins-semibold text-[14px] ml-1.5">
                  Create First Budget
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      {budgets.length > 0 && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          className="absolute bottom-8 right-6 w-16 h-16 rounded-full items-center justify-center"
          style={{
            backgroundColor: "#7C3AED",
            elevation: 8,
            shadowColor: "#7C3AED",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
          }}
        >
          <Icon name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Budget Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/45">
              <TouchableOpacity activeOpacity={1}>
                <View className="bg-white rounded-t-[32px] px-6 pt-3 pb-8">
                  <View className="items-center mb-5">
                    <View className="w-10 h-1 rounded-full bg-gray-200" />
                  </View>

                  <Text className="text-xl font-poppins-bold text-gray-900 mb-1">
                    New budget
                  </Text>
                  <Text className="text-gray-400 text-[13px] font-poppins mb-6">
                    Set your spending limit
                  </Text>

                  {/* Category */}
                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    Category
                  </Text>
                  <View className="border border-gray-100 rounded-2xl mb-5 overflow-hidden bg-gray-50">
                    <Picker
                      selectedValue={category}
                      onValueChange={(value) => setCategory(value)}
                      style={{ height: 52 }}
                    >
                      <Picker.Item label="🍔 Food" value="FOOD" />
                      <Picker.Item label="🚕 Transport" value="TRANSPORT" />
                      <Picker.Item label="🩺 Health" value="HEALTH" />
                      <Picker.Item
                        label="🎬 Entertainment"
                        value="ENTERTAINMENT"
                      />
                      <Picker.Item label="🛍️ Shopping" value="SHOPPING" />
                      <Picker.Item label="📚 Education" value="EDUCATION" />
                      <Picker.Item label="📦 Other" value="OTHER" />
                    </Picker>
                  </View>

                  {/* Amount */}
                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    Budget Amount
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3.5 mb-5 border border-gray-100">
                    <Text className="text-gray-400 text-lg font-poppins-semibold mr-2">
                      {currency.symbol}
                    </Text>
                    <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#C4C4CC"
                      className="flex-1 text-lg font-poppins-semibold text-gray-900"
                    />
                  </View>

                  {/* Month & Year */}
                  <View className="flex-row gap-3 mb-7">
                    <View className="flex-1">
                      <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                        Month
                      </Text>
                      <TextInput
                        value={month}
                        onChangeText={setMonth}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder="06"
                        placeholderTextColor="#C4C4CC"
                        className="border border-gray-100 rounded-2xl px-4 py-3.5 text-center text-[15px] font-poppins-medium bg-gray-50 text-gray-900"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                        Year
                      </Text>
                      <TextInput
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                        maxLength={4}
                        placeholder="2026"
                        placeholderTextColor="#C4C4CC"
                        className="border border-gray-100 rounded-2xl px-4 py-3.5 text-center text-[15px] font-poppins-medium bg-gray-50 text-gray-900"
                      />
                    </View>
                  </View>

                  {/* Buttons */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="flex-1 py-4 rounded-2xl bg-gray-100"
                    >
                      <Text className="text-center font-poppins-semibold text-gray-600 text-[14px]">
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleCreateBudget}
                      disabled={submitting}
                      className="flex-1 py-4 rounded-2xl bg-violet-600"
                      style={{ opacity: submitting ? 0.6 : 1 }}
                    >
                      <Text className="text-center font-poppins-semibold text-white text-[14px]">
                        {submitting ? "Creating..." : "Create Budget"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default BudgetScreen;

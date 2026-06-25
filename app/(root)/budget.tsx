import { useAuth } from "@/context/AuthContext";
import Icon from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const { userId } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const [category, setCategory] = useState("FOOD");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const handleCreateBudget = async () => {
    try {
      if (!amount) {
        Alert.alert("Validation", "Please enter budget amount");
        return;
      }

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
      Alert.alert("Success", "Budget created successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create budget");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const now = new Date();
      const data = await getBudgetStatus(6, now.getFullYear());
      setBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="px-6 pt-14 pb-8 bg-white">
          <Text className="text-4xl font-poppins-bold text-gray-900">
            Budgets
          </Text>
          <Text className="text-gray-500 mt-1 text-lg">
            Track your monthly spending goals
          </Text>
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

              return (
                <View
                  key={budget.category}
                  className="bg-white rounded-3xl p-6 mb-5 shadow-sm border border-gray-100"
                >
                  {/* Category Header */}
                  <View className="flex-row items-center justify-between mb-5">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-12 h-12 rounded-2xl items-center justify-center"
                        style={{
                          backgroundColor: `${categoryColors[budget.category] || "#8B5CF6"}15`,
                        }}
                      >
                        <Icon
                          name={categoryIcons[budget.category] || "wallet"}
                          size={26}
                          color={categoryColors[budget.category] || "#8B5CF6"}
                        />
                      </View>
                      <Text className="font-poppins-semibold text-2xl text-gray-900">
                        {budget.category}
                      </Text>
                    </View>

                    <View
                      className={`px-4 py-1.5 rounded-full ${
                        exceeded ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          exceeded ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {exceeded ? "OVER BUDGET" : "ON TRACK"}
                      </Text>
                    </View>
                  </View>

                  {/* Amounts */}
                  <View className="flex-row justify-between items-end mb-4">
                    <View>
                      <Text className="text-gray-500 text-sm">Budget</Text>
                      <Text className="text-3xl font-poppins-semibold text-gray-900 mt-1">
                        ₹{budget.budget.toLocaleString()}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-gray-500 text-sm">Remaining</Text>
                      <Text
                        className={`text-2xl font-semibold mt-1 ${
                          exceeded ? "text-red-500" : "text-emerald-600"
                        }`}
                      >
                        ₹{remaining.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          categoryColors[budget.category] || "#8B5CF6",
                      }}
                    />
                  </View>

                  {/* Spent & Percentage */}
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-500 text-sm">Spent</Text>
                      <Text className="font-semibold text-lg text-gray-800">
                        ₹{budget.spent.toLocaleString()}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-gray-500 text-sm">Used</Text>
                      <Text className="font-semibold text-lg text-gray-800">
                        {budget.percentageUsed.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            /* Empty State */
            <View className="items-center justify-center py-20">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                <Icon name="wallet-outline" size={48} color="#9CA3AF" />
              </View>
              <Text className="text-2xl font-poppins-semibold text-gray-900 mb-2">
                No budgets yet
              </Text>
              <Text className="text-gray-500 text-center text-lg max-w-[260px]">
                Create your first budget to start tracking your monthly spending
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="mt-8 flex-row items-center gap-2 bg-violet-600 px-8 py-4 rounded-2xl active:bg-violet-700"
              >
                <Icon name="add" size={24} color="white" />
                <Text className="text-white font-poppins-semibold text-lg">
                  Create First Budget
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button - Hidden when no budgets (optional) */}
      {budgets.length > 0 && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-8 right-6 w-16 h-16 rounded-full items-center justify-center active:scale-95"
          style={{
            backgroundColor: "#8B5CF6",
            elevation: 8,
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Icon name="add" size={32} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Budget Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
            <Text className="text-3xl font-poppins-bold text-gray-900 mb-1">
              New Budget
            </Text>
            <Text className="text-gray-500 mb-8">Set your spending limit</Text>

            {/* Category */}
            <Text className="text-gray-600 font-medium mb-2">Category</Text>
            <View className="border border-gray-200 rounded-2xl mb-6 overflow-hidden bg-gray-50">
              <Picker
                selectedValue={category}
                onValueChange={(value) => setCategory(value)}
                style={{ height: 56 }}
              >
                <Picker.Item label="🍔 Food" value="FOOD" />
                <Picker.Item label="🚕 Transport" value="TRANSPORT" />
                <Picker.Item label="🩺 Health" value="HEALTH" />
                <Picker.Item label="🎬 Entertainment" value="ENTERTAINMENT" />
                <Picker.Item label="🛍️ Shopping" value="SHOPPING" />
                <Picker.Item label="📚 Education" value="EDUCATION" />
                <Picker.Item label="📦 Other" value="OTHER" />
              </Picker>
            </View>

            {/* Amount */}
            <Text className="text-gray-600 font-medium mb-2">
              Budget Amount
            </Text>
            <View className="relative mb-6">
              <Text className="absolute left-4 top-4 text-gray-400 text-xl font-medium">
                ₹
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                className="border border-gray-200 rounded-2xl pl-10 pr-4 py-4 text-xl font-semibold bg-gray-50"
              />
            </View>

            {/* Month & Year */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1">
                <Text className="text-gray-600 font-medium mb-2">Month</Text>
                <TextInput
                  value={month}
                  onChangeText={setMonth}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="06"
                  className="border border-gray-200 rounded-2xl px-4 py-4 text-center text-lg font-medium bg-gray-50"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 font-medium mb-2">Year</Text>
                <TextInput
                  value={year}
                  onChangeText={setYear}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="2026"
                  className="border border-gray-200 rounded-2xl px-4 py-4 text-center text-lg font-medium bg-gray-50"
                />
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 py-4 rounded-2xl bg-gray-100 active:bg-gray-200"
              >
                <Text className="text-center font-semibold text-gray-700 text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateBudget}
                className="flex-1 py-4 rounded-2xl bg-violet-600 active:bg-violet-700"
              >
                <Text className="text-center font-semibold text-white text-lg">
                  Create Budget
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BudgetScreen;

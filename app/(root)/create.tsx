import { categories, Category, Transaction } from "@/constants/types";
import { useSharedCurrency } from "@/context/CurrencyContext";
import { useTransactions } from "@/context/TransactionContext";
import Icon from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const CreateExpense = () => {
  const { createTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE"); // 'income' or 'expense'
  const [selectedCategory, setSelectedCategory] = useState<Category>("OTHERS");

  const { currency } = useSharedCurrency();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const transactionDate = date.toISOString().split("T")[0];

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const payload: Transaction = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: selectedCategory.toUpperCase() as Category,
      type: type,
      note: note.trim(),
      currency: currency.code,
      transactionDate,
    };

    try {
      await createTransaction(payload);
      // alert("Transaction created successfully!");
      // Reset form
      setAmount("");
      setTitle("");
      setNote("");
      setType("EXPENSE");
      setSelectedCategory("OTHERS");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Transaction created successfully",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* content */}
      {/* Header */}
      <View className="rounded-b-3xl overflow-hidden">
        <LinearGradient
          colors={["#8B5CF6", "#EC4899", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-10 px-6"
        >
          <Text className="text-white/80 text-sm font-poppins">
            New Transaction
          </Text>
          <Text className="text-white text-3xl font-poppins-bold mt-1">
            Create {type === "INCOME" ? "Income" : "Expense"}
          </Text>
        </LinearGradient>
      </View>

      {/* Form */}
      <View className="px-6 -mt-8 pb-8">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Type Selector */}
          <Text className="text-gray-500 text-xs font-poppins mb-2">Type</Text>
          <View className="flex-row gap-3 mb-5">
            <TouchableOpacity
              onPress={() => {
                setType("EXPENSE");
                setSelectedCategory("OTHERS");
              }}
              className="flex-1"
            >
              <View
                className={`rounded-xl p-4 border-2 ${
                  type === "EXPENSE"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Icon
                  name="arrow-down-circle"
                  size={24}
                  color={type === "EXPENSE" ? "#EC4899" : "#9CA3AF"}
                />
                <Text
                  className={`mt-2 font-poppins-bold ${
                    type === "EXPENSE" ? "text-pink-600" : "text-gray-500"
                  }`}
                >
                  Expense
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setType("INCOME");
                setSelectedCategory("OTHERS");
              }}
              className="flex-1"
            >
              <View
                className={`rounded-xl p-4 border-2 ${
                  type === "INCOME"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Icon
                  name="arrow-up-circle"
                  size={24}
                  color={type === "INCOME" ? "#8B5CF6" : "#9CA3AF"}
                />
                <Text
                  className={`mt-2 font-poppins-bold ${
                    type === "INCOME" ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  Income
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <Text className="text-gray-500 text-xs font-poppins mb-1">
            Amount
          </Text>
          <View className="flex-row justify-center items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
            <Text className="text-gray-400  font-poppins-extrabold  mr-2  ">
              {currency.code}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              className="flex-1 text-gray-800 text-base font-poppins "
            />
          </View>

          {/* Category */}
          <Text className="text-gray-500 text-xs font-poppins mb-2">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {categories[type].map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  setSelectedCategory(category.id);
                }}
              >
                <View
                  className={`rounded-xl px-4 py-3 border ${
                    selectedCategory === category.id
                      ? type === "INCOME"
                        ? "border-purple-500 bg-purple-50"
                        : "border-pink-500 bg-pink-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon
                      name={category.icon}
                      size={16}
                      color={
                        selectedCategory === category.id
                          ? type === "INCOME"
                            ? "#8B5CF6"
                            : "#EC4899"
                          : "#9CA3AF"
                      }
                    />
                    <Text
                      className={`text-sm font-poppins ${
                        selectedCategory === category.id
                          ? type === "INCOME"
                            ? "text-purple-600"
                            : "text-pink-600"
                          : "text-gray-600"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text className="text-gray-500 text-xs font-poppins mb-1">Title</Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
            <Icon name="pricetag-outline" size={18} color="#9CA3AF" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
              placeholder="Groceries, Rent, Coffee..."
              className="flex-1 ml-2 text-gray-800 text-base font-poppins"
            />
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-4 mb-4">
              <Icon name="calendar-outline" size={18} color="#9CA3AF" />

              <Text className="ml-2 text-gray-800 text-base font-poppins">
                {transactionDate}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Note */}
          <Text className="text-gray-500 text-xs font-poppins mb-1">
            Note (optional)
          </Text>
          <View className="bg-gray-100 rounded-xl px-4 py-3 mb-6">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholderTextColor="#9CA3AF"
              placeholder="Add a note..."
              multiline
              numberOfLines={3}
              className="text-gray-800 text-base font-poppins"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit}>
            <View className="rounded-xl overflow-hidden">
              <LinearGradient
                colors={["#8B5CF6", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 items-center"
              >
                <Text className="text-white text-base font-poppins-bold">
                  Add {type === "INCOME" ? "Income" : "Expense"}
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreateExpense;

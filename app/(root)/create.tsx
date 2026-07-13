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
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [selectedCategory, setSelectedCategory] = useState<Category>("OTHERS");
  const [submitting, setSubmitting] = useState(false);

  const { currency } = useSharedCurrency();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const transactionDate = date.toISOString().split("T")[0];
  const accent = type === "INCOME" ? "#8B5CF6" : "#EC4899";

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: "Please enter a valid amount",
      });
      return;
    }
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Title",
        text2: "Please enter a title",
      });
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

    setSubmitting(true);
    try {
      await createTransaction(payload);
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
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-[#F7F7FB]"
    >
      {/* Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-12 px-6"
        >
          <Text className="text-white/60 text-[13px] font-poppins">
            New transaction
          </Text>
          <Text className="text-white text-[26px] font-poppins-bold mt-1">
            Add {type === "INCOME" ? "Income" : "Expense"}
          </Text>
        </LinearGradient>
      </View>

      {/* Form */}
      <View className="px-6 -mt-6 pb-10">
        <View
          className="bg-white rounded-[28px] p-6"
          style={{
            shadowColor: "#1E1B2E",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 18,
            elevation: 6,
          }}
        >
          {/* Type Selector */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2.5">
            Type
          </Text>
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setType("EXPENSE");
                setSelectedCategory("OTHERS");
              }}
              className="flex-1"
            >
              <View
                className={`rounded-2xl p-4 border ${
                  type === "EXPENSE"
                    ? "border-pink-200 bg-pink-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <Icon
                  name="arrow-down-circle"
                  size={22}
                  color={type === "EXPENSE" ? "#EC4899" : "#B0AFC0"}
                />
                <Text
                  className={`mt-2 font-poppins-semibold text-[14px] ${
                    type === "EXPENSE" ? "text-pink-600" : "text-gray-400"
                  }`}
                >
                  Expense
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setType("INCOME");
                setSelectedCategory("OTHERS");
              }}
              className="flex-1"
            >
              <View
                className={`rounded-2xl p-4 border ${
                  type === "INCOME"
                    ? "border-violet-200 bg-violet-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <Icon
                  name="arrow-up-circle"
                  size={22}
                  color={type === "INCOME" ? "#8B5CF6" : "#B0AFC0"}
                />
                <Text
                  className={`mt-2 font-poppins-semibold text-[14px] ${
                    type === "INCOME" ? "text-violet-600" : "text-gray-400"
                  }`}
                >
                  Income
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2.5">
            Amount
          </Text>
          <View
            className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mb-6 border"
            style={{ borderColor: `${accent}30` }}
          >
            <Text
              className="font-poppins-bold text-base mr-2.5"
              style={{ color: accent }}
            >
              {currency.code}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#C4C4CC"
              keyboardType="decimal-pad"
              className="flex-1 text-gray-900 text-2xl font-poppins-semibold"
            />
          </View>

          {/* Category */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2.5">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {categories[type].map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View
                    className={`flex-row items-center rounded-full px-4 py-2.5 border ${
                      isSelected
                        ? type === "INCOME"
                          ? "border-violet-200 bg-violet-50"
                          : "border-pink-200 bg-pink-50"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <Icon
                      name={category.icon}
                      size={15}
                      color={isSelected ? accent : "#B0AFC0"}
                    />
                    <Text
                      className={`ml-1.5 text-[13px] font-poppins-medium ${
                        isSelected
                          ? type === "INCOME"
                            ? "text-violet-600"
                            : "text-pink-600"
                          : "text-gray-500"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Title */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
            Title
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3.5 mb-4 border border-gray-100">
            <Icon name="pricetag-outline" size={17} color="#B0AFC0" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#C4C4CC"
              placeholder="Groceries, Rent, Coffee..."
              className="flex-1 ml-2.5 text-gray-900 text-[15px] font-poppins"
            />
          </View>

          {/* Date */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
            Date
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl px-4 py-3.5 mb-4 border border-gray-100">
              <View className="flex-row items-center">
                <Icon name="calendar-outline" size={17} color="#B0AFC0" />
                <Text className="ml-2.5 text-gray-900 text-[15px] font-poppins">
                  {transactionDate}
                </Text>
              </View>
              <Icon name="chevron-down" size={16} color="#C4C4CC" />
            </View>
          </TouchableOpacity>

          {/* Note */}
          <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
            Note (optional)
          </Text>
          <View className="bg-gray-50 rounded-2xl px-4 py-3.5 mb-7 border border-gray-100">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholderTextColor="#C4C4CC"
              placeholder="Add a note..."
              multiline
              style={{ minHeight: 64, textAlignVertical: "top" }}
              className="text-gray-900 text-[15px] font-poppins"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <View className="rounded-full overflow-hidden">
              <LinearGradient
                colors={["#7C3AED", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 items-center"
                style={{ opacity: submitting ? 0.6 : 1 }}
              >
                <Text className="text-white text-[15px] font-poppins-bold">
                  {submitting
                    ? "Adding..."
                    : `Add ${type === "INCOME" ? "Income" : "Expense"}`}
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

import { categories, Category, Transaction } from "@/constants/types";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: Transaction) => void;
  transaction: Transaction | null;
}

const EditTransactionModal = ({
  visible,
  onClose,
  onSubmit,
  transaction,
}: Props) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate fields when transaction changes
  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title ?? "");
      setAmount(String(transaction.amount ?? ""));
      setType(transaction.type ?? "EXPENSE");
      setCategory(transaction.category ?? "");
      setNote(transaction.note ?? "");
      setErrors({});
    }
  }, [transaction]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!category) newErrors.category = "Please select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      ...transaction!,
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category: category.toUpperCase() as Category,
      note: note.trim(),
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: "90%" }}>
            {/* Handle bar */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 bg-gray-200 rounded-full" />
            </View>

            {/* Header */}
            <View className="px-6 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-100">
              <Text className="text-gray-800 text-xl font-poppins-bold">
                Edit Transaction
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
              >
                <Icon name="close" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-6"
              contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Type Toggle */}
              <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-5">
                {(["EXPENSE", "INCOME"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className="flex-1 rounded-xl py-2.5 items-center overflow-hidden"
                  >
                    {type === t ? (
                      <LinearGradient
                        colors={
                          t === "EXPENSE"
                            ? ["#EF4444", "#F97316"]
                            : ["#8B5CF6", "#EC4899"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="absolute inset-0 rounded-xl"
                      />
                    ) : null}
                    <Text
                      className={`font-poppins-bold text-sm capitalize ${type === t ? "text-white" : "text-gray-500"
                        }`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Amount */}
              <View className="mb-4">
                <Text className="text-gray-500 text-xs font-poppins-bold mb-2">
                  AMOUNT
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3 ${errors.amount ? "border-red-400" : "border-gray-100"
                    }`}
                >
                  <Text className="text-gray-400 font-poppins-bold text-lg mr-2">
                    $
                  </Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    className="flex-1 text-gray-800 font-poppins text-lg"
                  />
                </View>
                {errors.amount && (
                  <Text className="text-red-400 text-xs font-poppins mt-1 ml-1">
                    {errors.amount}
                  </Text>
                )}
              </View>

              {/* Title */}
              <View className="mb-4">
                <Text className="text-gray-500 text-xs font-poppins-bold mb-2">
                  TITLE
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Grocery run"
                  className={`bg-gray-50 border rounded-2xl px-4 py-3 text-gray-800 font-poppins ${errors.title ? "border-red-400" : "border-gray-100"
                    }`}
                />
                {errors.title && (
                  <Text className="text-red-400 text-xs font-poppins mt-1 ml-1">
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="text-gray-500 text-xs font-poppins-bold mb-2">
                  CATEGORY
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories[type].map((cat) => {
                    const selected = category === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setCategory(cat.id)}
                        className="overflow-hidden rounded-2xl"
                      >
                        {selected ? (
                          <LinearGradient
                            colors={["#8B5CF6", "#EC4899"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="flex-row items-center px-3 py-2 gap-1"
                          >
                            <Icon
                              name={cat.icon as any}
                              size={14}
                              color="white"
                            />
                            <Text className="text-white font-poppins-bold text-xs ml-1">
                              {cat.name}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View className="flex-row items-center bg-gray-100 px-3 py-2 gap-1">
                            <Icon
                              name={cat.icon as any}
                              size={14}
                              color="#9CA3AF"
                            />
                            <Text className="text-gray-500 font-poppins text-xs ml-1">
                              {cat.name}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {errors.category && (
                  <Text className="text-red-400 text-xs font-poppins mt-1 ml-1">
                    {errors.category}
                  </Text>
                )}
              </View>

              {/* Note */}
              <View className="mb-6">
                <Text className="text-gray-500 text-xs font-poppins-bold mb-2">
                  NOTE{" "}
                  <Text className="text-gray-400 font-poppins normal-case">
                    (optional)
                  </Text>
                </Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-gray-800 font-poppins"
                  style={{ minHeight: 80 }}
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 bg-gray-100 rounded-2xl py-4 items-center"
                >
                  <Text className="text-gray-600 font-poppins-bold">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="flex-1 rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 items-center flex-row justify-center gap-2"
                  >
                    <Icon
                      name="checkmark-circle-outline"
                      size={18}
                      color="white"
                    />
                    <Text className="text-white font-poppins-bold ml-1">
                      Save Changes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTransactionModal;

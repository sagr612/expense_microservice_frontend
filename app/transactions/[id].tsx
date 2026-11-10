import Button from "@/components/Button";
import EditTransactionModal from "@/components/EditTransactionModel";
import {
  getCategoryColor,
  getCategoryIcon,
  Transaction,
} from "@/constants/types";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { useCurrency } from "@/hooks/useCurrency";
import { formatDate } from "@/utils/utility";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { getTransaction as fetchTransactionById } from "@/app/services/transactionService";

const cardShadow = {
  shadowColor: "#1E1B2E",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.05,
  shadowRadius: 14,
  elevation: 3,
};

const TransactionDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, deleteTransaction, updateTransaction } =
    useTransactions();
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [editModal, setEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(false);

  const { currency } = useCurrency();
  const { userId } = useAuth();

  useEffect(() => {
    if (!id) return;
    const inMemory = transactions.find(
      (t) => t.externalId === id || t.externalId === String(id),
    );
    if (inMemory) {
      setTransaction(inMemory);
      return;
    }

    if (userId) {
      setLoading(true);
      fetchTransactionById(userId, id)
        .then((data) => setTransaction(data))
        .catch((err) => console.log("Failed to fetch transaction by id:", err))
        .finally(() => setLoading(false));
    }
  }, [id, transactions, userId]);

  const typeLabel = (t?: Transaction) => {
    if (!t) return "";
    return t.type === "INCOME" ? "Income" : "Expense";
  };

  const handleDelete = () => {
    Toast.show({
      type: "info",
      text1: "Delete this transaction?",
      text2: "Tap here to confirm — this can't be undone",
      onPress: async () => {
        Toast.hide();
        setDeleting(true);
        try {
          await deleteTransaction(id!);
          router.back();
        } catch (err: any) {
          Toast.show({
            type: "error",
            text1: "Delete failed",
            text2: err?.message ?? "Please try again",
          });
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  const handleEditSubmit = async (payload: Transaction) => {
    try {
      await updateTransaction(id!, payload);
      Toast.show({
        type: "success",
        text1: "Transaction updated",
      });
      setEditModal(false);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: err?.message ?? "Please try again",
      });
    }
  };

  const isExpense = transaction?.type === "EXPENSE";
  const categoryColor = transaction
    ? getCategoryColor(transaction.category)
    : "#8B5CF6";

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F7F7FB]">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F7FB]">
      {/* Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-20 px-6"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
                <Icon name="arrow-back" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <Text className="text-white text-[15px] font-poppins-semibold">
              Transaction
            </Text>

            <View className="w-10" />
          </View>

          {transaction && (
            <View className="items-center mt-7">
              <Text className="text-white text-4xl font-poppins-bold">
                {isExpense ? "-" : "+"}
                {currency.symbol}
                {Math.abs(transaction.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>

              <Text className="text-white/70 text-[14px] mt-1.5 font-poppins">
                {typeLabel(transaction)}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {transaction ? (
        <View className="px-6 -mt-11 flex-1">
          {/* Floating Icon */}
          <View className="items-center">
            <View
              className="w-[88px] h-[88px] rounded-full bg-white items-center justify-center"
              style={cardShadow}
            >
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: `${categoryColor}18` }}
              >
                <Icon
                  name={getCategoryIcon(transaction.category)}
                  size={30}
                  color={categoryColor}
                />
              </View>
            </View>
          </View>

          {/* Summary */}
          <View className="bg-white rounded-[28px] mt-5 p-6" style={cardShadow}>
            <Text
              numberOfLines={2}
              className="text-xl font-poppins-bold text-center text-gray-900"
            >
              {transaction.title}
            </Text>

            <View className="flex-row justify-center gap-2.5 mt-4">
              <View
                className={`px-3.5 py-1.5 rounded-full ${
                  isExpense ? "bg-red-50" : "bg-emerald-50"
                }`}
              >
                <Text
                  className={`font-poppins-semibold text-[12px] ${
                    isExpense ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {typeLabel(transaction)}
                </Text>
              </View>

              <View
                className="px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: `${categoryColor}18` }}
              >
                <Text
                  style={{ color: categoryColor }}
                  className="font-poppins-semibold text-[12px]"
                >
                  {transaction.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Details */}
          <View className="bg-white rounded-[28px] mt-4 p-6" style={cardShadow}>
            <Text className="text-base font-poppins-bold text-gray-900 mb-4">
              Details
            </Text>

            <View style={{ gap: 16 }}>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-[13px] font-poppins">
                  Date
                </Text>
                <Text className="font-poppins-semibold text-gray-900 text-[14px]">
                  {formatDate(
                    transaction.transactionDate ?? transaction.createdAt!,
                  )}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-[13px] font-poppins">
                  Currency
                </Text>
                <Text className="font-poppins-semibold text-gray-900 text-[14px]">
                  {currency.code}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-[13px] font-poppins">
                  Category
                </Text>
                <View className="flex-row items-center">
                  <Icon
                    name={getCategoryIcon(transaction.category)}
                    size={16}
                    color={categoryColor}
                  />
                  <Text className="ml-1.5 font-poppins-semibold text-gray-900 text-[14px]">
                    {transaction.category}
                  </Text>
                </View>
              </View>

              {transaction.note && (
                <>
                  <View className="h-px bg-gray-100" />
                  <View>
                    <Text className="text-gray-400 text-[13px] font-poppins mb-2">
                      Note
                    </Text>
                    <View className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
                      <Text className="text-gray-700 font-poppins text-[14px] leading-5">
                        {transaction.note}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3 mt-6 mb-8">
            <View className="flex-1">
              <Button
                title="Edit"
                onPress={() => setEditModal(true)}
                icon={<Icon name="pencil-outline" size={18} color="#7C3AED" />}
              />
            </View>

            <View className="flex-1">
              <Button
                title={deleting ? "Deleting..." : "Delete"}
                variant="danger"
                onPress={handleDelete}
                disabled={deleting}
                icon={<Icon name="trash-outline" size={18} color="#EF4444" />}
              />
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 rounded-full bg-violet-50 items-center justify-center">
            <Icon name="alert-circle-outline" size={40} color="#A855F7" />
          </View>
          <Text className="text-xl font-poppins-bold text-gray-900 mt-6">
            Transaction not found
          </Text>
          <Text className="text-gray-400 text-center text-[14px] font-poppins mt-2 leading-6">
            This transaction doesn&apos;t exist or may have been deleted.
          </Text>
        </View>
      )}

      {transaction && (
        <EditTransactionModal
          visible={editModal}
          onClose={() => setEditModal(false)}
          onSubmit={handleEditSubmit}
          transaction={transaction}
        />
      )}
    </View>
  );
};

export default TransactionDetail;

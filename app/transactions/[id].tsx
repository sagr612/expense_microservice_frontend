import Button from "@/components/Button";
import EditTransactionModal from "@/components/EditTransactionModel";
import {
  getCategoryColor,
  getCategoryIcon,
  Transaction,
} from "@/constants/types";
import { useTransactions } from "@/context/TransactionContext";
import { useCurrency } from "@/hooks/useCurrency";
import { formatDate } from "@/utils/utility";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const TransactionDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, deleteTransaction, updateTransaction } =
    useTransactions();
  const [transaction, settransaction] = useState<Transaction | undefined>();
  const [viewEditModal, setviewEditModal] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    if (!id) return undefined;
    const t = transactions.find(
      (t) => t.externalId === id || t.externalId === String(id),
    );
    settransaction(t);
    console.log("Transaction found:", t);
  }, [id, transactions]);

  const typeLabel = (t?: Transaction) => {
    if (!t) return "";
    return t.type === "INCOME" ? "Income" : "Expense";
  };
  const handleDelete = async () => {
    deleteTransaction(id!);
    router.back();
  };

  const [editModal, setEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModal(true);
  };
  const handleEditSubmit = async (payload: Transaction) => {
    try {
      await updateTransaction(id!, payload);
      Alert.alert("Success", "Transaction updated!");
      setEditModal(false);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="rounded-b-[40px] overflow-hidden">
        <LinearGradient
          colors={["#8B5CF6", "#EC4899", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-16 pb-20 px-6"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="arrow-back" size={26} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-xl font-poppins-bold">
              Transaction
            </Text>

            <View className="w-6" />
          </View>

          {transaction && (
            <View className="items-center mt-8">
              <Text
                className={`text-5xl font-poppins-bold ${
                  transaction.type === "EXPENSE"
                    ? "text-red-100"
                    : "text-green-100"
                }`}
              >
                {currency.code} {Math.abs(transaction.amount).toFixed(2)}
              </Text>

              <Text className="text-white/80 text-lg mt-2 font-poppins">
                {typeLabel(transaction)}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {transaction ? (
        <View className="px-6 -mt-12">
          {/* Floating Icon */}

          <View className="items-center">
            <View
              className="w-24 h-24 rounded-full bg-white items-center justify-center border-4 border-gray-100"
              style={{
                elevation: 8,
              }}
            >
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{
                  backgroundColor: `${getCategoryColor(
                    transaction.category,
                  )}20`,
                }}
              >
                <Icon
                  name={getCategoryIcon(transaction.category)}
                  size={34}
                  color={getCategoryColor(transaction.category)}
                />
              </View>
            </View>
          </View>

          {/* Summary */}

          <View
            className="bg-white rounded-3xl mt-6 p-6"
            style={{ elevation: 4 }}
          >
            <Text className="text-2xl font-poppins-bold text-center text-gray-900">
              {transaction.title}
            </Text>

            <View className="flex-row justify-center gap-3 mt-4">
              <View
                className={`px-4 py-2 rounded-full ${
                  transaction.type === "EXPENSE" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <Text
                  className={`font-poppins-semibold ${
                    transaction.type === "EXPENSE"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {typeLabel(transaction)}
                </Text>
              </View>

              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${getCategoryColor(
                    transaction.category,
                  )}20`,
                }}
              >
                <Text
                  style={{
                    color: getCategoryColor(transaction.category),
                  }}
                  className="font-poppins-semibold"
                >
                  {transaction.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Details */}

          <View
            className="bg-white rounded-3xl mt-5 p-6"
            style={{ elevation: 4 }}
          >
            <Text className="text-xl font-poppins-bold mb-5">Details</Text>

            <View className="flex-col gap-5">
              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-poppins">Date</Text>

                <Text className="font-poppins-semibold text-gray-800">
                  {formatDate(
                    transaction.transactionDate ?? transaction.createdAt!,
                  )}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-500 font-poppins">Currency</Text>

                <Text className="font-poppins-semibold text-gray-800">
                  {currency.code}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-poppins">Category</Text>

                <View className="flex-row items-center">
                  <Icon
                    name={getCategoryIcon(transaction.category)}
                    size={18}
                    color={getCategoryColor(transaction.category)}
                  />

                  <Text className="ml-2 font-poppins-semibold">
                    {transaction.category}
                  </Text>
                </View>
              </View>

              {transaction.note && (
                <View>
                  <Text className="text-gray-500 mb-2 font-poppins">Note</Text>

                  <View className="bg-gray-100 rounded-2xl p-4">
                    <Text className="text-gray-700 font-poppins">
                      {transaction.note}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Buttons */}

          <View className="flex-row gap-4 mt-6 mb-8">
            <View className="flex-1">
              <Button
                title="Edit"
                onPress={() => handleEdit(transaction)}
                icon={<Icon name="pencil-outline" size={18} color="#6366F1" />}
              />
            </View>

            <View className="flex-1">
              <Button
                title="Delete"
                variant="danger"
                onPress={handleDelete}
                icon={<Icon name="trash-outline" size={18} color="#EF4444" />}
              />
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Icon name="alert-circle-outline" size={70} color="#9CA3AF" />

          <Text className="text-xl font-poppins-bold mt-5">
            Transaction Not Found
          </Text>

          <Text className="text-gray-500 text-center mt-2">
            This transaction doesn't exist or may have been deleted.
          </Text>
        </View>
      )}

      {transaction && (
        <EditTransactionModal
          visible={editModal}
          onClose={() => setEditModal(false)}
          onSubmit={handleEditSubmit}
          transaction={selectedTransaction}
        />
      )}
    </View>
  );
};

export default TransactionDetail;

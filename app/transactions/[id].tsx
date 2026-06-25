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
      <View className="rounded-b-3xl overflow-hidden">
        <LinearGradient
          colors={["#8B5CF6", "#EC4899", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-16 pb-6 px-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-poppins-bold">
              Transaction
            </Text>
            <View className="w-6" />
          </View>
        </LinearGradient>
      </View>

      {transaction ? (
        <View className="px-6 -mt-10">
          <View
            className="bg-white rounded-3xl p-6 shadow-sm"
            style={{
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: `${getCategoryColor(
                      transaction.category,
                    )}20`,
                  }}
                >
                  <Icon
                    name={getCategoryIcon(transaction.category)}
                    size={30}
                    color={getCategoryColor(transaction.category)}
                  />
                </View>
                <View>
                  <Text className="text-xl font-poppins-bold text-gray-900">
                    {transaction.title}
                  </Text>
                  <Text className="text-sm text-gray-500 font-poppins">
                    {typeLabel(transaction)} • {transaction.category}
                  </Text>
                </View>
              </View>

              <Text
                className={`text-xl font-poppins-bold ${
                  transaction.type === "EXPENSE"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {Math.abs(transaction.amount).toFixed(2)} {currency.code}
              </Text>
            </View>

            <View className="mt-6 flex-col gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-500 font-poppins">
                  Date
                </Text>
                <Text className="text-base text-gray-700 font-poppins">
                  {formatDate(transaction.createdAt!)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-500 font-poppins">
                  Category
                </Text>
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: `${getCategoryColor(
                        transaction.category,
                      )}20`,
                    }}
                  >
                    <Icon
                      name={getCategoryIcon(transaction.category)}
                      size={20}
                      color={getCategoryColor(transaction.category)}
                    />
                  </View>
                  <Text className="text-base text-gray-700 font-poppins ">
                    {transaction.category}
                  </Text>
                </View>
              </View>

              {transaction.note ? (
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-gray-500 font-poppins">
                    Note
                  </Text>
                  <Text className="text-base text-gray-700 font-poppins mt-1">
                    {transaction.note}
                  </Text>
                </View>
              ) : null}

              <View className="flex-row items-center justify-between">
                <Button
                  title="Edit"
                  onPress={() => handleEdit(transaction)}
                  icon={
                    <Icon name="pencil-outline" size={18} color="#6366f1" />
                  }
                />
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  variant="danger"
                  icon={<Icon name="trash-outline" size={18} color="#ef4444" />}
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-base font-poppins-bold mt-4">
            Transaction not found
          </Text>
          <Text className="text-gray-400 text-sm font-poppins mt-2 text-center">
            This transaction may have been removed or does not exist.
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

import TransactionItem from "@/components/TransactionItem";
import { useSharedCurrency } from "@/context/CurrencyContext";
import { useTransactions } from "@/context/TransactionContext";
import { useCurrency } from "@/hooks/useCurrency";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AllTransactions = () => {
  const { transactions, isLoading, isLoadingMore, refresh, loadMore } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // 'all', 'income', 'expense'
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [tempMinAmount, setTempMinAmount] = useState("");
  const [tempMaxAmount, setTempMaxAmount] = useState("");

  const { currency } = useSharedCurrency();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (transaction.category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      (transaction.note?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesType =
      selectedType === "all" ||
      transaction.type?.toLowerCase() === selectedType.toLowerCase();

    const amount = Math.abs(transaction.amount ?? 0);
    const min = minAmount ? parseFloat(minAmount) : 0;
    const max = maxAmount ? parseFloat(maxAmount) : Infinity;
    const matchesAmount = amount >= min && amount <= max;

    return matchesSearch && matchesType && matchesAmount;
  });

  const handleApplyFilter = () => {
    setMinAmount(tempMinAmount);
    setMaxAmount(tempMaxAmount);
    setFilterModalVisible(false);
  };

  const handleResetFilter = () => {
    setTempMinAmount("");
    setTempMaxAmount("");
    setMinAmount("");
    setMaxAmount("");
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedType !== "all") count++;
    if (minAmount || maxAmount) count++;
    return count;
  };

  return (
    <View className="flex-1 bg-[#F7F7FB]">
      {/* Hero Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-20 px-6"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/15 items-center justify-center"
            >
              <Icon name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            <View className="ml-4">
              <Text className="text-[26px] leading-tight font-poppins-bold text-white">
                Transactions
              </Text>
              <Text className="text-white/60 text-sm mt-0.5 font-poppins">
                Search and manage your history
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Floating Search */}
      <View className="px-6 -mt-8 z-20">
        <View
          className="bg-white rounded-[22px] px-5 py-3.5 flex-row items-center"
          style={{
            shadowColor: "#1E1B2E",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Icon name="search" size={20} color="#A855F7" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search title, category or note..."
            placeholderTextColor="#B0AFC0"
            className="flex-1 ml-3 text-[15px] font-poppins text-gray-900"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={20} color="#C4C4CC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="px-6 mt-5">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setSelectedType("all")}
            className={`px-4 py-2.5 rounded-full mr-2 ${selectedType === "all" ? "bg-violet-600" : "bg-white"
              }`}
            style={
              selectedType !== "all"
                ? { borderWidth: 1, borderColor: "#EDEBF3" }
                : undefined
            }
          >
            <Text
              className={`font-poppins-semibold text-[13px] ${selectedType === "all" ? "text-white" : "text-gray-500"
                }`}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("income")}
            className={`px-4 py-2.5 rounded-full mr-2 ${selectedType === "income" ? "bg-emerald-500" : "bg-white"
              }`}
            style={
              selectedType !== "income"
                ? { borderWidth: 1, borderColor: "#EDEBF3" }
                : undefined
            }
          >
            <View className="flex-row items-center">
              <Icon
                name="arrow-down"
                size={13}
                color={selectedType === "income" ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-1.5 font-poppins-semibold text-[13px] ${selectedType === "income" ? "text-white" : "text-gray-500"
                  }`}
              >
                Income
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("expense")}
            className={`px-4 py-2.5 rounded-full ${selectedType === "expense" ? "bg-red-500" : "bg-white"
              }`}
            style={
              selectedType !== "expense"
                ? { borderWidth: 1, borderColor: "#EDEBF3" }
                : undefined
            }
          >
            <View className="flex-row items-center">
              <Icon
                name="arrow-up"
                size={13}
                color={selectedType === "expense" ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-1.5 font-poppins-semibold text-[13px] ${selectedType === "expense" ? "text-white" : "text-gray-500"
                  }`}
              >
                Expense
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-1" />

          <TouchableOpacity
            onPress={() => {
              setTempMinAmount(minAmount);
              setTempMaxAmount(maxAmount);
              setFilterModalVisible(true);
            }}
          >
            <View
              className="w-11 h-11 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#1E1B2E",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Icon name="options-outline" size={19} color="#8B5CF6" />
              {activeFiltersCount() > 0 && (
                <View className="absolute -top-1 -right-1 bg-pink-500 w-5 h-5 rounded-full items-center justify-center border-2 border-[#F7F7FB]">
                  <Text className="text-white text-[10px] font-poppins-bold">
                    {activeFiltersCount()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {(minAmount || maxAmount) && (
          <View className="mt-4 bg-violet-50 rounded-2xl px-4 py-3 flex-row items-center">
            <Icon name="pricetag" size={16} color="#8B5CF6" />
            <Text className="ml-2.5 text-violet-700 flex-1 text-[13px] font-poppins-medium">
              Amount: {minAmount || "0"} – {maxAmount || "No limit"}
            </Text>
            <TouchableOpacity onPress={handleResetFilter}>
              <Icon name="close-circle" size={18} color="#A855F7" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Results count */}
      <View className="flex-row items-center justify-between mx-6 mt-5 mb-3">
        <Text className="text-gray-400 text-[13px] font-poppins">
          {filteredTransactions.length} result
          {filteredTransactions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          renderItem={({ item }) => (
            <View className="mb-3 px-6">
              <TransactionItem item={item} />
            </View>
          )}
          keyExtractor={(item) => item.externalId!}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}

          ListFooterComponent={() =>
            isLoadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#8B5CF6" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              tintColor="#8B5CF6"
            />
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-violet-50 items-center justify-center">
            <Icon name="search-outline" size={44} color="#A855F7" />
          </View>
          <Text className="text-xl font-poppins-bold text-gray-900 mt-6">
            Nothing found
          </Text>
          <Text className="text-center text-gray-400 text-[14px] mt-2 leading-6 font-poppins">
            Try different keywords or clear your filters to see more results.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSelectedType("all");
              handleResetFilter();
            }}
            className="mt-6"
          >
            <View className="rounded-full px-6 py-3 bg-violet-600">
              <Text className="text-white font-poppins-semibold text-[13px]">
                Clear filters
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setFilterModalVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/45">
              <TouchableOpacity activeOpacity={1}>
                <View className="bg-white rounded-t-[32px] px-6 pt-3 pb-8">
                  <View className="items-center mb-6">
                    <View className="w-10 h-1 rounded-full bg-gray-200" />
                  </View>

                  <View className="flex-row items-center justify-between mb-6">
                    <View>
                      <Text className="text-xl font-poppins-bold text-gray-900">
                        Amount range
                      </Text>
                      <Text className="text-gray-400 text-[13px] mt-0.5 font-poppins">
                        Filter transactions by amount
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setFilterModalVisible(false)}
                    >
                      <Icon name="close" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    From
                  </Text>
                  <View className="bg-gray-50 rounded-2xl px-4 py-3.5 flex-row items-center mb-4 border border-gray-100">
                    <Text className="text-lg text-gray-400 mr-2">
                      {currency.symbol}
                    </Text>
                    <TextInput
                      value={tempMinAmount}
                      onChangeText={setTempMinAmount}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#C4C4CC"
                      className="flex-1 text-base font-poppins text-gray-900"
                    />
                  </View>

                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    To
                  </Text>
                  <View className="bg-gray-50 rounded-2xl px-4 py-3.5 flex-row items-center border border-gray-100">
                    <Text className="text-lg text-gray-400 mr-2">
                      {currency.symbol}
                    </Text>
                    <TextInput
                      value={tempMaxAmount}
                      onChangeText={setTempMaxAmount}
                      keyboardType="decimal-pad"
                      placeholder="No limit"
                      placeholderTextColor="#C4C4CC"
                      className="flex-1 text-base font-poppins text-gray-900"
                    />
                  </View>

                  <View className="flex-row mt-8">
                    <TouchableOpacity
                      onPress={() => {
                        handleResetFilter();
                        setFilterModalVisible(false);
                      }}
                      className="flex-1 mr-3 bg-gray-100 rounded-2xl py-4 items-center"
                    >
                      <Text className="font-poppins-semibold text-gray-600 text-[14px]">
                        Reset
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-1 bg-violet-600 rounded-2xl py-4 items-center"
                      onPress={handleApplyFilter}
                    >
                      <Text className="text-white font-poppins-bold text-[14px]">
                        Apply filter
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

export default AllTransactions;

import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { DUMMY_TRANSACTIONS } from "@/constants/dummydata";
import TransactionItem from "@/components/TransactionItem";

const AllTransactions = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all"); // 'all', 'income', 'expense'
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [tempMinAmount, setTempMinAmount] = useState("");
    const [tempMaxAmount, setTempMaxAmount] = useState("");

    // Filter transactions based on search, type, and amount
    const filteredTransactions = DUMMY_TRANSACTIONS.filter((transaction) => {
        // Search filter
        const matchesSearch =
            transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filter
        const matchesType =
            selectedType === "all" ||
            transaction.type.toLowerCase() === selectedType.toLowerCase();

        // Amount filter
        const amount = Math.abs(transaction.amount);
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
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="rounded-b-3xl overflow-hidden">
                <LinearGradient
                    colors={["#8B5CF6", "#EC4899", "#F97316"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-6 px-6"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Icon name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-xl font-poppins-bold">
                            All Transactions
                        </Text>
                        <View className="w-6" />
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white/20 backdrop-blur-lg rounded-xl px-4 py-3">
                        <Icon name="search" size={20} color="white" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search transactions..."
                            placeholderTextColor="rgba(255,255,255,0.7)"
                            className="flex-1 ml-2 text-white font-poppins"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Icon name="close-circle" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </LinearGradient>
            </View>

            {/* Filter Chips */}
            <View className="px-6 py-4">
                <View className="flex-row items-center gap-2">
                    {/* Type Filter Chips */}
                    <TouchableOpacity
                        onPress={() => setSelectedType("all")}
                        className={`rounded-full px-4 py-2 ${
                            selectedType === "all"
                                ? "bg-purple-100 border-2 border-purple-500"
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        <Text
                            className={`text-sm font-poppins-bold ${
                                selectedType === "all"
                                    ? "text-purple-600"
                                    : "text-gray-600"
                            }`}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedType("income")}
                        className={`rounded-full px-4 py-2 flex-row items-center gap-1 ${
                            selectedType === "income"
                                ? "bg-green-100 border-2 border-green-500"
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        <Icon
                            name="arrow-down"
                            size={14}
                            color={selectedType === "income" ? "#10B981" : "#6B7280"}
                        />
                        <Text
                            className={`text-sm font-poppins-bold ${
                                selectedType === "income"
                                    ? "text-green-600"
                                    : "text-gray-600"
                            }`}
                        >
                            Income
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedType("expense")}
                        className={`rounded-full px-4 py-2 flex-row items-center gap-1 ${
                            selectedType === "expense"
                                ? "bg-red-100 border-2 border-red-500"
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        <Icon
                            name="arrow-up"
                            size={14}
                            color={selectedType === "expense" ? "#EF4444" : "#6B7280"}
                        />
                        <Text
                            className={`text-sm font-poppins-bold ${
                                selectedType === "expense"
                                    ? "text-red-600"
                                    : "text-gray-600"
                            }`}
                        >
                            Expense
                        </Text>
                    </TouchableOpacity>

                    {/* Amount Filter Button */}
                    <TouchableOpacity
                        onPress={() => {
                            setTempMinAmount(minAmount);
                            setTempMaxAmount(maxAmount);
                            setFilterModalVisible(true);
                        }}
                        className="ml-auto rounded-full p-2 bg-white border border-gray-200 relative"
                    >
                        <Icon name="options-outline" size={20} color="#6B7280" />
                        {activeFiltersCount() > 1 && (
                            <View className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full items-center justify-center">
                                <Text className="text-white text-xs font-poppins-bold">
                                    {activeFiltersCount()}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Active Amount Filter Display */}
                {(minAmount || maxAmount) && (
                    <View className="mt-2 flex-row items-center bg-purple-50 rounded-lg px-3 py-2">
                        <Icon name="pricetag" size={14} color="#8B5CF6" />
                        <Text className="text-purple-600 text-xs font-poppins ml-2 flex-1">
                            Amount: ${minAmount || "0"} - ${maxAmount || "∞"}
                        </Text>
                        <TouchableOpacity onPress={handleResetFilter}>
                            <Icon name="close-circle" size={16} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Results Count */}
            <View className="px-6 pb-2">
                <Text className="text-gray-500 text-sm font-poppins">
                    {filteredTransactions.length} transaction
                    {filteredTransactions.length !== 1 ? "s" : ""} found
                </Text>
            </View>

            {/* Transactions List */}
            <View className="flex-1 px-6">
                {filteredTransactions.length > 0 ? (
                    <FlatList
                        data={filteredTransactions}
                        renderItem={({ item }) => <TransactionItem item={item} />}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Icon name="search-outline" size={64} color="#D1D5DB" />
                        <Text className="text-gray-400 text-base font-poppins-bold mt-4">
                            No transactions found
                        </Text>
                        <Text className="text-gray-400 text-sm font-poppins mt-1">
                            Try adjusting your filters
                        </Text>
                    </View>
                )}
            </View>

            {/* Filter Modal */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-gray-800 text-xl font-poppins-bold">
                                Filter by Amount
                            </Text>
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Min Amount */}
                        <Text className="text-gray-500 text-xs font-poppins mb-2">
                            Minimum Amount
                        </Text>
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
                            <Text className="text-gray-400 text-lg mr-2">$</Text>
                            <TextInput
                                value={tempMinAmount}
                                onChangeText={setTempMinAmount}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                className="flex-1 text-gray-800 text-base font-poppins"
                            />
                        </View>

                        {/* Max Amount */}
                        <Text className="text-gray-500 text-xs font-poppins mb-2">
                            Maximum Amount
                        </Text>
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
                            <Text className="text-gray-400 text-lg mr-2">$</Text>
                            <TextInput
                                value={tempMaxAmount}
                                onChangeText={setTempMaxAmount}
                                placeholder="No limit"
                                keyboardType="decimal-pad"
                                className="flex-1 text-gray-800 text-base font-poppins"
                            />
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => {
                                    handleResetFilter();
                                    setFilt
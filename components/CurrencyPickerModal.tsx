import { CURRENCIES, Currency } from "@/constants/currencies";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    visible: boolean;
    selected: Currency;
    onSelect: (currency: Currency) => void;
    onClose: () => void;
}

const CurrencyPickerModal = ({ visible, selected, onSelect, onClose }: Props) => {
    const [search, setSearch] = useState("");

    const filtered = CURRENCIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (currency: Currency) => {
        onSelect(currency);
        setSearch("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl" style={{ maxHeight: "80%" }}>

                    {/* Header */}
                    <View className="px-6 pt-6 pb-4">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-gray-800 text-xl font-poppins-bold">
                                Select Currency
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Icon name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Search bar */}
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
                            <Icon name="search-outline" size={18} color="#9CA3AF" />
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search currency..."
                                className="flex-1 ml-2 font-poppins text-gray-800"
                            />
                            {search.length > 0 && (
                                <TouchableOpacity onPress={() => setSearch("")}>
                                    <Icon name="close-circle" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Currency List */}
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.code}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                        renderItem={({ item }) => {
                            const isSelected = item.code === selected.code;
                            return (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    className="flex-row items-center py-3 border-b border-gray-50"
                                >
                                    {/* Flag + info */}
                                    <Text style={{ fontSize: 28 }}>{item.flag}</Text>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-gray-800 font-poppins-bold text-sm">
                                            {item.code}
                                        </Text>
                                        <Text className="text-gray-500 font-poppins text-xs">
                                            {item.name}
                                        </Text>
                                    </View>

                                    {/* Symbol + checkmark */}
                                    <Text className="text-gray-400 font-poppins mr-3">
                                        {item.symbol}
                                    </Text>
                                    {isSelected && (
                                        <LinearGradient
                                            colors={["#8B5CF6", "#EC4899"]}
                                            className="w-6 h-6 rounded-full items-center justify-center"
                                        >
                                            <Icon name="checkmark" size={14} color="white" />
                                        </LinearGradient>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <View className="items-center py-10">
                                <Text className="text-gray-400 font-poppins">No currencies found</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

export default CurrencyPickerModal;

import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const NameModal = ({
  visible,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onClose,
  onSave,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-gray-800 text-xl font-poppins-bold mb-4">
            Edit Name
          </Text>
          <Text className="text-gray-500 text-xs font-poppins mb-2">
            First Name
          </Text>
          <TextInput
            value={firstName}
            onChangeText={onFirstNameChange}
            placeholder="Enter new first name"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 font-poppins mb-6"
          />
          <Text className="text-gray-500 text-xs font-poppins mb-2">
            Last Name
          </Text>
          <TextInput
            value={lastName}
            onChangeText={onLastNameChange}
            placeholder="Enter new last name"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 font-poppins mb-6"
          />
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
            >
              <Text className="text-gray-600 font-poppins-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              className="flex-1 rounded-xl overflow-hidden"
            >
              <LinearGradient
                colors={["#8B5CF6", "#EC4899"]}
                className="py-3 items-center"
              >
                <Text className="text-white font-poppins-bold">Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NameModal;

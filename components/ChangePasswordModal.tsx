import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const ChangePasswordModal = ({
  visible,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onClose,
  onSave,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-gray-800 text-xl font-poppins-bold mb-4">
            Change Password
          </Text>

          <Text className="text-gray-500 text-xs font-poppins mb-2">
            Current Password
          </Text>
          <TextInput
            value={currentPassword}
            onChangeText={onCurrentPasswordChange}
            placeholder="Enter current password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 font-poppins mb-4"
          />

          <Text className="text-gray-500 text-xs font-poppins mb-2">
            New Password
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={onNewPasswordChange}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 font-poppins mb-4"
          />

          <Text className="text-gray-500 text-xs font-poppins mb-2">
            Confirm Password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
            placeholder="Confirm new password"
            secureTextEntry
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
                <Text className="text-white font-poppins-bold">Update</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

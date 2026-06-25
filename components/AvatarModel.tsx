import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  visible: boolean;
  avatarUri?: string;
  uploading: boolean;
  onClose: () => void;
  onChooseFromLibrary: () => void;
}

const AvatarModel = ({
  visible,
  avatarUri,
  uploading,
  onClose,
  onChooseFromLibrary,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm items-center">
          <Text className="text-gray-800 text-xl font-poppins-bold mb-2">
            Change Avatar
          </Text>
          <Text className="text-gray-500 text-xs font-poppins mb-6 text-center">
            Choose a new profile picture from your library
          </Text>

          {/* Preview current avatar */}
          <Image
            source={{
              uri: avatarUri ?? "https://i.pravatar.cc/150?img=12",
            }}
            className="w-28 h-28 rounded-full border-4 border-purple-100 mb-6"
          />

          {/* Pick from Library */}
          <TouchableOpacity
            onPress={onChooseFromLibrary}
            disabled={uploading}
            className="w-full rounded-xl overflow-hidden mb-3"
          >
            <LinearGradient
              colors={["#8B5CF6", "#EC4899"]}
              className="py-3 items-center flex-row justify-center gap-2"
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="image-outline" size={18} color="white" />
                  <Text className="text-white font-poppins-bold ml-2">
                    Choose from Library
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            onPress={onClose}
            disabled={uploading}
            className="w-full bg-gray-100 rounded-xl py-3 items-center"
          >
            <Text className="text-gray-600 font-poppins-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarModel;

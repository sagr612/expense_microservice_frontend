import AvatarModel from "@/components/AvatarModel";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import CurrencyPickerModal from "@/components/CurrencyPickerModal";
import NameModal from "@/components/NameModal";
import UserNameModal from "@/components/UserNameModal";
import { useAuth } from "@/context/AuthContext";
import { useSharedCurrency } from "@/context/CurrencyContext";
import { useUser } from "@/context/UserContext";
import { SettingsSection } from "@/interfaces/UserTypes";
import Icon from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { changePassword } from "../services/authService";

const Settings = () => {
  const { user: authUser, userId, logout, changeUsername } = useAuth();
  const { user, getUser, isLoading, uploadAvatar, createUpdateUser } =
    useUser();
  // const { currency, setCurrency } = useCurrency();
  const { currency, setCurrency } = useSharedCurrency();

  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);

  const handleChangeAvatar = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // force square crop
      quality: 0.8,
    });

    if (result.canceled) return;
    console.log("Result : ", result);
    const uri = result.assets[0].uri;

    const filename = uri.split("/").pop() ?? "avatar.jpg";

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: filename,
      type: "image/jpeg",
    } as any);

    try {
      setUploading(true);
      console.log("Uploading avatar...");

      // Refresh user so profile pic updates everywhere
      await uploadAvatar(userId!, formData);
      if (userId) await getUser(userId);
      setAvatarModal(false);
      Alert.alert("Success", "Profile picture updated!");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (userId && !user) {
      getUser(userId);
    }
  }, [userId, getUser, user]);

  const handleChangeUsername = async () => {
    setUsernameModalVisible(false);
    try {
      if (!newUsername || !authUser) {
        console.error("New Username not initialized.");
        return;
      }
      await changeUsername(newUsername, authUser);
      Alert.alert("Success", "Username changed");
    } catch (err: any) {
      console.error("Username change failed:", err.message);
      Alert.alert("Error", err.message);
    }
    setNewUsername("");
  };

  const handleChangePassword = async () => {
    if (newPassword === confirmPassword && currentPassword) {
      try {
        await changePassword({
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        console.log("Password changed successfully");
        Alert.alert("Success", "Password changed");
        setPasswordModalVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err: any) {
        console.error("Password change failed:", err.message);
        Alert.alert("Error", err.message);
      }
    } else {
      console.log("Passwords don't match or current password is empty");
    }
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    await logout();
  };

  const handleChangeName = async () => {
    if (firstName || lastName || !userId) {
      try {
        const updatedFirstName = firstName || user?.first_name || "";
        const updatedLastName = lastName || user?.last_name || "";

        const reqpayload = {
          user_id: userId!,
          first_name: updatedFirstName,
          last_name: updatedLastName,
          phone_number: user?.phone_number,
          email: user?.email,
          profile_pic: user?.profile_pic,
          profile_image_public_id: user?.profile_image_public_id,
        };

        await createUpdateUser(reqpayload);

        Alert.alert("Success", "Name updated");
        getUser(userId!);
        setNameModal(false);
        setFirstName("");
        setLastName("");
      } catch (err: any) {
        console.error("Name change failed:", err.message);
        Alert.alert("Error", err.message);
      }
    } else {
      console.log("No changes made to name");
    }
  };

  const settingsOptions: SettingsSection[] = [
    {
      id: "profile",
      title: "Profile Settings",
      items: [
        {
          id: "edit-name",
          icon: "person-outline",
          label: "Edit Name",
          value: user
            ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
            : "",
          onPress: () => setNameModal(true),
        },

        {
          id: "edit-avatar",
          icon: "image-outline",
          label: "Change Avatar",
          value: "Update profile picture",
          onPress: () => setAvatarModal(true),
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      items: [
        {
          id: "change-password",
          icon: "lock-closed-outline",
          label: "Change Password",
          value: "••••••••",
          onPress: () => setPasswordModalVisible(true),
        },
        {
          id: "change-username",
          icon: "person-outline",
          label: "Change Username",
          value: authUser ?? "",
          onPress: () => setUsernameModalVisible(true),
        },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      items: [
        {
          id: "currency",
          icon: "cash-outline",
          label: "Currency",
          value: `${currency.flag}  ${currency.code} (${currency.symbol})`,
          onPress: () => setCurrencyModal(true),
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {isLoading && !user ? (
        <View className="flex-1 justify-center items-center h-screen">
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="rounded-b-3xl overflow-hidden">
            <LinearGradient
              colors={["#8B5CF6", "#EC4899", "#F97316"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="pt-14 pb-10 px-6"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white/80 text-sm font-poppins">
                    Account
                  </Text>
                  <Text className="text-white text-3xl font-poppins-bold mt-1">
                    Settings
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="close" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Profile Card */}
          <View className="px-6 -mt-8 mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-lg items-center">
              <View className="relative">
                <Image
                  source={{
                    uri:
                      user?.profile_pic ?? "https://i.pravatar.cc/150?img=12",
                  }}
                  className="w-24 h-24 rounded-full border-4 border-purple-100"
                />
              </View>
              <Text className="text-gray-800 text-xl font-poppins-bold mt-4">
                {user
                  ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                  : authUser}
              </Text>
              <Text className="text-gray-500 text-sm font-poppins mt-1">
                {user?.email ?? authUser}
              </Text>
              <Text className="text-gray-500 text-sm font-poppins mt-1">
                {authUser}
              </Text>
            </View>
          </View>

          {/* Settings Options */}
          <View className="px-6">
            {settingsOptions.map((section) => (
              <View key={section.id} className="mb-6">
                <Text className="text-gray-500 text-xs font-poppins-bold uppercase mb-3 px-2">
                  {section.title}
                </Text>
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {section.items.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={item.onPress}
                      className={`flex-row items-center p-4 ${
                        index !== section.items.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center">
                        <Icon name={item.icon} size={20} color="#8B5CF6" />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-gray-800 font-poppins-bold text-sm">
                          {item.label}
                        </Text>
                        <Text className="text-gray-500 font-poppins text-xs mt-0.5">
                          {item.value}
                        </Text>
                      </View>
                      <Icon name="chevron-forward" size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} className="mb-8">
              <View className="bg-white rounded-2xl shadow-sm p-4 flex-row items-center">
                <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                  <Icon name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <Text className="text-red-500 font-poppins-bold text-sm ml-3">
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <UserNameModal
            visible={usernameModalVisible}
            username={newUsername}
            onUsernameChange={setNewUsername}
            onClose={() => setUsernameModalVisible(false)}
            onSave={handleChangeUsername}
          />

          <ChangePasswordModal
            visible={passwordModalVisible}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onClose={() => setPasswordModalVisible(false)}
            onSave={handleChangePassword}
          />

          <NameModal
            visible={nameModal}
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onClose={() => setNameModal(false)}
            onSave={handleChangeName}
          />

          {/* Avatar Modal */}
          <AvatarModel
            visible={avatarModal}
            avatarUri={user?.profile_pic}
            uploading={uploading}
            onChooseFromLibrary={handleChangeAvatar}
            onClose={() => setAvatarModal(false)}
          />
          <CurrencyPickerModal
            visible={currencyModal}
            selected={currency}
            onSelect={setCurrency}
            onClose={() => setCurrencyModal(false)}
          />
        </>
      )}
    </ScrollView>
  );
};
export default Settings;

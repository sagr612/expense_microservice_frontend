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
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { changePassword } from "../services/authService";

const Settings = () => {
  const { user: authUser, userId, logout, changeUsername } = useAuth();
  const { user, getUser, isLoading, uploadAvatar, createUpdateUser } =
    useUser();
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: "Permission Required",
        text2: "Please allow access to your photo library.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
      await uploadAvatar(userId!, formData);
      if (userId) await getUser(userId);
      setAvatarModal(false);
      Toast.show({
        type: "success",
        text1: "Profile Picture Updated",
        text2: "Your profile picture has been updated successfully.",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: err.message ?? "Upload failed",
      });
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
        Toast.show({
          type: "error",
          text1: "Username Change Failed",
          text2: "New username not initialized.",
        });
        return;
      }
      await changeUsername(newUsername, authUser);
      Toast.show({
        type: "success",
        text1: "Username Changed",
        text2: "Your username has been changed successfully.",
      });
    } catch (err: any) {
      console.error("Username change failed:", err.message);
      Toast.show({
        type: "error",
        text1: "Username Change Failed",
        text2: err.message ?? "Username change failed.",
      });
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
        Toast.show({
          type: "success",
          text1: "Password Changed",
          text2: "Your password has been changed successfully.",
        });
        setPasswordModalVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err: any) {
        console.error("Password change failed:", err.message);
        Toast.show({
          type: "error",
          text1: "Password Change Failed",
          text2: err.message ?? "Password change failed.",
        });
      }
    } else {
      console.log("Passwords don't match or current password is empty");
      Toast.show({
        type: "error",
        text1: "Password Change Failed",
        text2: "Passwords don't match or current password is empty.",
      });
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
        Toast.show({
          type: "success",
          text1: "Name Updated",
          text2: "Your name has been updated successfully.",
        });
        getUser(userId!);
        setNameModal(false);
        setFirstName("");
        setLastName("");
      } catch (err: any) {
        console.error("Name change failed:", err.message);
        Toast.show({
          type: "error",
          text1: "Name Change Failed",
          text2: err.message ?? "Name change failed.",
        });
      }
    } else {
      console.log("No changes made to name");
      Toast.show({
        type: "info",
        text1: "No Changes Made",
        text2: "No changes were made to your name.",
      });
    }
  };

  const settingsOptions: SettingsSection[] = [
    {
      id: "profile",
      title: "Profile",
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
    <ScrollView
      className="flex-1 bg-[#F7F7FB]"
      showsVerticalScrollIndicator={false}
    >
      {isLoading && !user ? (
        <View
          className="flex-1 justify-center items-center"
          style={{ height: 500 }}
        >
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="rounded-b-[36px] overflow-hidden">
            <LinearGradient
              colors={["#7C3AED", "#A855F7", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="pt-14 pb-16 px-6"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white/60 text-[13px] font-poppins">
                    Account
                  </Text>
                  <Text className="text-white text-[26px] font-poppins-bold mt-0.5">
                    Settings
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                  <View className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
                    <Icon name="close" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Profile Card */}
          <View className="px-6 -mt-10 mb-6">
            <View
              className="bg-white rounded-[28px] p-6 items-center"
              style={{
                shadowColor: "#1E1B2E",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 18,
                elevation: 6,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setAvatarModal(true)}
              >
                <View className="relative">
                  <Image
                    source={{
                      uri:
                        user?.profile_pic ?? "https://i.pravatar.cc/150?img=12",
                    }}
                    className="w-24 h-24 rounded-full"
                    style={{ borderWidth: 3, borderColor: "#F3E8FF" }}
                  />
                  <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-violet-600 items-center justify-center border-2 border-white">
                    <Icon name="camera" size={14} color="white" />
                  </View>
                </View>
              </TouchableOpacity>

              <Text className="text-gray-900 text-xl font-poppins-bold mt-4">
                {user
                  ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                  : authUser}
              </Text>
              <Text className="text-gray-400 text-[13px] font-poppins mt-1">
                {user?.email ?? authUser}
              </Text>

              <View className="mt-3 bg-violet-50 rounded-full px-3 py-1">
                <Text className="text-violet-600 text-[12px] font-poppins-semibold">
                  @{authUser}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Options */}
          <View className="px-6">
            {settingsOptions.map((section) => (
              <View key={section.id} className="mb-6">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2.5 px-1">
                  {section.title}
                </Text>
                <View
                  className="bg-white rounded-[24px] overflow-hidden"
                  style={{
                    shadowColor: "#1E1B2E",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {section.items.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={item.onPress}
                      className={`flex-row items-center px-4 py-4 ${
                        index !== section.items.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="w-10 h-10 bg-violet-50 rounded-full items-center justify-center">
                        <Icon name={item.icon} size={18} color="#8B5CF6" />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-gray-900 font-poppins-semibold text-[14px]">
                          {item.label}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-gray-400 font-poppins text-[12px] mt-0.5"
                        >
                          {item.value}
                        </Text>
                      </View>
                      <Icon name="chevron-forward" size={18} color="#D8D6E3" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Logout Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleLogout}
              className="mb-8"
            >
              <View
                className="bg-white rounded-[24px] p-4 flex-row items-center"
                style={{
                  shadowColor: "#1E1B2E",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                  <Icon name="log-out-outline" size={18} color="#EF4444" />
                </View>
                <Text className="text-red-500 font-poppins-semibold text-[14px] ml-3">
                  Log out
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

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { resetPassword } from "../services/authService";
import { extractErrorMessage } from "@/utils/utility";

const ResetPassword = () => {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Invalid link",
        text2: "Reset token is missing or link is invalid",
      });
      return;
    }

    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Missing password",
        text2: "Please fill in both password fields",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords don't match",
        text2: "Please ensure both passwords match",
      });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Weak password",
        text2: "Password must be at least 8 characters",
      });
      return;
    }
    setSubmitting(true);

    try {
      await resetPassword({ token, newPassword });
      Toast.show({
        type: "success",
        text1: "Password updated!",
        text2: "You can now sign in with your new password",
      });
      router.replace("/(auth)/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Reset failed",
        text2: extractErrorMessage(err, "Token expired or invalid"),
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <LinearGradient
        colors={["#7C3AED", "#A855F7", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center px-6 py-12">
            {/* Header */}
            <View className="mb-8 items-center">
              <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-5">
                <Icon name="key-outline" size={30} color="white" />
              </View>
              <Text className="font-poppins-bold text-[30px] text-white text-center">
                New Password
              </Text>
              <Text className="text-white/70 text-[14px] text-center font-poppins mt-1 px-4">
                Create a strong new password for your account
              </Text>
            </View>
            {/* Card */}
            <View
              className="w-full max-w-md bg-white rounded-[32px] p-7"
              style={{
                shadowColor: "#1E1B2E",
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.2,
                shadowRadius: 30,
                elevation: 12,
              }}
            >
              {/* New Password */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  New Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="lock-closed-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Enter new password"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={8}
                  >
                    <Icon
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={19}
                      color="#B0AFC0"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Confirm Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="lock-closed-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Confirm new password"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={8}
                  >
                    <Icon
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={19}
                      color="#B0AFC0"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleReset}
                disabled={submitting}
                className="rounded-2xl overflow-hidden mb-4"
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#7C3AED", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-14 justify-center items-center flex-row"
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-poppins-bold text-[15px]">
                      Update Password
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default ResetPassword;

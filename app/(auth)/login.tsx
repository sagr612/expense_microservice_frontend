import { useAuth } from "@/context/AuthContext";
import { extractErrorMessage } from "@/utils/utility";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const Login = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!userName.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Please enter your username and password",
      });
      return;
    }

    setSubmitting(true);
    try {
      await login(userName.trim(), password);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: extractErrorMessage(
          err,
          "Please check your details and try again",
        ),
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
            {/* Welcome Header */}
            <View className="mb-8 items-center">
              <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-5">
                <Icon name="wallet" size={30} color="white" />
              </View>
              <Text className="font-poppins-bold text-[34px] text-white text-center">
                Welcome back
              </Text>
              <Text className="text-white/70 text-[15px] text-center font-poppins mt-1">
                Sign in to manage your finances
              </Text>
            </View>

            {/* Login Card */}
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
              {/* Username Input */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Username
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="person-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={userName}
                    onChangeText={setUserName}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-3">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="lock-closed-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
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

              {/* Forgot Password */}
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity className="mb-6 self-end">
                  <Text className="text-violet-600 text-[13px] font-poppins-semibold">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Link>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={submitting}
                className="rounded-2xl overflow-hidden mb-6"
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
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-100" />
                <Text className="text-gray-300 text-xs font-poppins-semibold mx-4">
                  OR
                </Text>
                <View className="flex-1 h-px bg-gray-100" />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-500 text-[14px] font-poppins">
                  Don&apos;t have an account?{" "}
                </Text>
                <Link href="/(auth)/SignUp" asChild>
                  <TouchableOpacity>
                    <Text className="text-violet-600 font-poppins-bold text-[14px]">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default Login;

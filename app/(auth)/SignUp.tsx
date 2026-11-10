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

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phoneNumber.trim() ||
      !userName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Please fill all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords don't match",
        text2: "Please make sure both passwords are the same",
      });
      return;
    }

    setSubmitting(true);
    try {
      await signUp(
        firstName.trim(),
        lastName.trim(),
        userName.trim(),
        phoneNumber.trim(),
        email.trim(),
        password,
      );
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: extractErrorMessage(err, "Please try again"),
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
            <View className="mb-7 items-center">
              <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-5">
                <Icon name="person-add" size={28} color="white" />
              </View>
              <Text className="font-poppins-bold text-[32px] text-white text-center">
                Get started
              </Text>
              <Text className="text-white/70 text-[15px] text-center font-poppins mt-1">
                Create your account to track expenses
              </Text>
            </View>

            {/* Signup Card */}
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
              {/* First / Last name — paired on one row to save vertical space */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    First name
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-3.5 h-14 border border-gray-100">
                    <Icon name="person-outline" size={18} color="#B0AFC0" />
                    <TextInput
                      placeholder="First name"
                      placeholderTextColor="#C4C4CC"
                      autoCapitalize="words"
                      value={firstName}
                      onChangeText={setFirstName}
                      className="flex-1 ml-2 text-gray-900 text-[14px] font-poppins"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                    Last name
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-3.5 h-14 border border-gray-100">
                    <Icon name="person-outline" size={18} color="#B0AFC0" />
                    <TextInput
                      placeholder="Last name"
                      placeholderTextColor="#C4C4CC"
                      autoCapitalize="words"
                      value={lastName}
                      onChangeText={setLastName}
                      className="flex-1 ml-2 text-gray-900 text-[14px] font-poppins"
                    />
                  </View>
                </View>
              </View>

              {/* Username */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Username
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="at-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Choose a username"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={userName}
                    onChangeText={setUserName}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Phone number
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="call-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor="#C4C4CC"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Email address
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="mail-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#C4C4CC"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 ml-3 text-gray-900 text-[15px] font-poppins"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="lock-closed-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <View className="mb-5">
                <Text className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wide mb-2">
                  Confirm password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border border-gray-100">
                  <Icon name="lock-closed-outline" size={19} color="#B0AFC0" />
                  <TextInput
                    placeholder="Confirm your password"
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

              {/* Terms & Conditions */}
              <Text className="text-xs text-gray-400 text-center font-poppins mb-6 leading-5">
                By signing up, you agree to our{" "}
                <Text className="text-violet-600 font-poppins-semibold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-violet-600 font-poppins-semibold">
                  Privacy Policy
                </Text>
              </Text>

              {/* Signup Button */}
              <TouchableOpacity
                onPress={handleSignup}
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
                      Create Account
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

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-500 text-[14px] font-poppins">
                  Already have an account?{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-violet-600 font-poppins-bold text-[14px]">
                      Sign In
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

export default SignUp;

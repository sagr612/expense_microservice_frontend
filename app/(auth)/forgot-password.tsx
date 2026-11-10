import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useReducer, useState } from "react";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { forgotPassword } from "../services/authService";
import { extractErrorMessage } from "@/utils/utility";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSendLink = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing email",
        text2: "Please enter your registered email address",
      });
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setEmailSent(true);
      Toast.show({
        type: "success",
        text1: "Email sent!",
        text2: "Check your inbox for the password reset link",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Request failed",
        text2: extractErrorMessage(
          err,
          "Could not send reset link. Try again.",
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
            {/* Header */}
            <View className="mb-8 items-center">
              <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-5">
                <Icon name="mail-open-outline" size={30} color="white" />
              </View>
              <Text className="font-poppins-bold text-[30px] text-white text-center">
                Reset Password
              </Text>
              <Text className="text-white/70 text-[14px] text-center font-poppins mt-1 px-4">
                {emailSent
                  ? "We have sent a reset link to your email"
                  : "Enter your email and we'll send you a link to reset your password"}
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
              {!emailSent ? (
                <>
                  <View className="mb-5">
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
                  <TouchableOpacity
                    onPress={handleSendLink}
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
                          Send Reset Link
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <View className="items-center py-4">
                  <View className="w-14 h-14 rounded-full bg-green-50 items-center justify-center mb-4">
                    <Icon name="checkmark-circle" size={32} color="#10B981" />
                  </View>
                  <Text className="font-poppins-bold text-gray-900 text-lg mb-2 text-center">
                    Check your email
                  </Text>
                  <Text className="font-poppins text-gray-500 text-[14px] text-center mb-6">
                    A password reset link was sent to{"\n"}
                    <Text className="font-poppins-semibold text-gray-800">
                      {email}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/(auth)/login")}
                    className="w-full h-14 rounded-2xl bg-violet-600 justify-center items-center mb-3"
                  >
                    <Text className="text-white font-poppins-bold text-[15px]">
                      Back to Sign In
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEmailSent(false)}
                    className="py-2"
                  >
                    <Text className="text-gray-400 font-poppins text-xs">
                      Didn&apos;t get the email? Try again
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Back to Login Link */}
              {!emailSent && (
                <View className="flex-row justify-center items-center mt-2">
                  <Text className="text-gray-500 text-[14px] font-poppins">
                    Remember your password?{" "}
                  </Text>
                  <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                      <Text className="text-violet-600 font-poppins-bold text-[14px]">
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;

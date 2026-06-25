import { useAuth } from "@/context/AuthContext";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Login = () => {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const {login}=useAuth();

    const handleLogin =async () => {
        console.log(userName, password);
      await login(userName, password);
    };

    return (
      <KeyboardAwareScrollView
    enableOnAndroid
    extraScrollHeight={50}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ flexGrow: 1 }}
>
   {/* content */}
            <LinearGradient
                colors={["#8B5CF6", "#EC4899", "#F97316"]}
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
                        <View className="mb-8">
                            <Text className="font-poppins-extrabold text-5xl text-white text-center mb-2">
                                Welcome Back!
                            </Text>
                            <Text className="text-white/80 text-base text-center font-poppins">
                                Sign in to manage your finances
                            </Text>
                        </View>

                        {/* Login Card */}
                        <View className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                            <Text className="font-poppins-bold text-2xl text-gray-800 mb-6 text-center">
                                Sign In
                            </Text>

                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Username
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="mail-outline" size={20} color="#8B5CF6" />
                                    <TextInput
                                        placeholder="Enter your username"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        value={userName}
                                        onChangeText={setUserName}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Password
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="lock-closed-outline" size={20} color="#8B5CF6" />
                                    <TextInput
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="ml-2"
                                    >
                                        <Icon
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity className="mb-6">
                                <Text className="text-purple-600 text-sm font-poppins-bold text-right">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                className="rounded-xl overflow-hidden mb-6"
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={["#8B5CF6", "#EC4899"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="h-14 justify-center items-center"
                                >
                                    <Text className="text-white font-poppins-bold text-base">
                                        Sign In
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center mb-6">
                                <View className="flex-1 h-px bg-gray-200" />
                                <Text className="text-gray-400 text-xs font-poppins mx-4">
                                    OR
                                </Text>
                                <View className="flex-1 h-px bg-gray-200" />
                            </View>

                            {/* Sign Up Link */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 text-sm font-poppins">
                                    Don't have an account?{" "}
                                </Text>
                                <Link href="/(auth)/SignUp" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-purple-600 font-poppins-bold text-sm">
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
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

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [lastName, setLastName] = useState("")


    const {signUp} = useAuth();

    const handleSignup = async () => {
        // Add validation
        if (!firstName || !lastName || !phoneNumber || !userName || !email || !password || !confirmPassword) {
            console.log("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }

        console.log("Signup pressed");
        await signUp(firstName, lastName, userName, phoneNumber, email, password)
        // Your signup logic here
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
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center px-6 py-12">
                        {/* Welcome Header */}
                        <View className="mb-8">
                            <Text className="font-poppins-extrabold text-5xl text-white text-center mb-2">
                                Get Started!
                            </Text>
                            <Text className="text-white/80 text-base text-center font-poppins">
                                Create your account to track expenses
                            </Text>
                        </View>

                        {/* Signup Card */}
                        <View className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                            <Text className="font-poppins-bold text-2xl text-gray-800 mb-6 text-center">
                                Create Account
                            </Text>

                            {/* Name Input */}
                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    First Name
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="person-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="words"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Last Name
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="person-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="words"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    User Name
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="person-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="words"
                                        value={userName}
                                        onChangeText={setUserName}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Phone Number
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="person-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="words"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                </View>
                            </View>

                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Email Address
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="mail-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={setEmail}
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
                                    <Icon name="lock-closed-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Create a password"
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

                            {/* Confirm Password Input */}
                            <View className="mb-4">
                                <Text className="text-gray-500 text-xs font-poppins mb-2">
                                    Confirm Password
                                </Text>
                                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14">
                                    <Icon name="lock-closed-outline" size={20} color="#8B5CF6"/>
                                    <TextInput
                                        placeholder="Confirm your password"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        className="flex-1 ml-3 text-gray-800 text-base font-poppins"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="ml-2"
                                    >
                                        <Icon
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Terms & Conditions */}
                            <View className="mb-6">
                                <Text className="text-xs text-gray-500 text-center font-poppins">
                                    By signing up, you agree to our{" "}
                                    <Text className="text-purple-600 font-poppins-bold">
                                        Terms of Service
                                    </Text>
                                    {" "}and{" "}
                                    <Text className="text-purple-600 font-poppins-bold">
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>

                            {/* Signup Button */}
                            <TouchableOpacity
                                onPress={handleSignup}
                                className="rounded-xl overflow-hidden mb-6"
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={["#8B5CF6", "#EC4899"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    className="h-14 justify-center items-center"
                                >
                                    <Text className="text-white font-poppins-bold text-base">
                                        Create Account
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center mb-6">
                                <View className="flex-1 h-px bg-gray-200"/>
                                <Text className="text-gray-400 text-xs font-poppins mx-4">
                                    OR
                                </Text>
                                <View className="flex-1 h-px bg-gray-200"/>
                            </View>

                            {/* Sign In Link */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 text-sm font-poppins">
                                    Already have an account?{" "}
                                </Text>
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-purple-600 font-poppins-bold text-sm">
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
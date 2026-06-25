import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { TransactionProvider } from "@/context/TransactionContext";
import { UserProvider } from "@/context/UserContext";
import Toast from "react-native-toast-message";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load fonts</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <UserProvider>
          <AuthProvider>
            <TransactionProvider>
              <CurrencyProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="(root)" />
                  <Stack.Screen name="(auth)" />
                </Stack>
                <Toast />
              </CurrencyProvider>
            </TransactionProvider>
          </AuthProvider>
        </UserProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#374151",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 20,
    color: "#ef4444",
    fontWeight: "600",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

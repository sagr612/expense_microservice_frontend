import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const MainAppLayout = () => {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  const { expoPushToken, notification } = usePushNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EC4899",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: "#000",
          shadowOffset: { height: -5, width: 0 },
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Poppins-SemiBold",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="home" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="home-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="all-transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="list" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="list-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="add" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="add-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="settings" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="settings-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="pie-chart" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="pie-chart-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                focused ? "" : ""
              }`}
            >
              {focused ? (
                <View className="w-12 h-12 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#8B5CF6", "#EC4899"]}
                    className="w-full h-full items-center justify-center"
                  >
                    <Icon name="wallet" size={24} color="white" />
                  </LinearGradient>
                </View>
              ) : (
                <Icon name="wallet-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default MainAppLayout;

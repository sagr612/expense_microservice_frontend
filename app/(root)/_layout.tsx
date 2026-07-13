import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

type TabIconProps = {
  name: React.ComponentProps<typeof Icon>["name"];
  activeName: React.ComponentProps<typeof Icon>["name"];
  color: string;
  focused: boolean;
};

const TabIcon = ({ name, activeName, color, focused }: TabIconProps) => {
  if (!focused) {
    return (
      <View className="w-11 h-11 items-center justify-center">
        <Icon name={name} size={22} color={color} />
      </View>
    );
  }

  return (
    <View className="w-11 h-11 rounded-2xl overflow-hidden">
      <LinearGradient
        colors={["#7C3AED", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-full items-center justify-center"
      >
        <Icon name={activeName} size={20} color="white" />
      </LinearGradient>
    </View>
  );
};

const MainAppLayout = () => {
  const { user } = useAuth();

  // Hooks must run unconditionally, before any early return.
  const { expoPushToken, notification } = usePushNotifications();
  const { unreadCount } = useNotifications();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#B0AFC0",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#1E1B2E",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Poppins-SemiBold",
          marginTop: 2,
        },
        tabBarBadgeStyle: {
          backgroundColor: "#EC4899",
          fontFamily: "Poppins-SemiBold",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="home-outline"
              activeName="home"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="all-transactions"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="list-outline"
              activeName="list"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="add-circle-outline"
              activeName="add-circle"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="pie-chart-outline"
              activeName="pie-chart"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="wallet-outline"
              activeName="wallet"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="notifications-outline"
              activeName="notifications"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="settings-outline"
              activeName="settings"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainAppLayout;

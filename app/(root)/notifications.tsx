import { notificationColors, notificationIcons } from "@/constants/types";
import { useNotifications } from "@/context/NotificationContext";
import Icon from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

const cardShadow = {
  shadowColor: "#1E1B2E",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

export default function NotificationsScreen() {
  const { notifications, unreadCount, loading, refresh, markNotificationRead } =
    useNotifications();

  return (
    <View className="flex-1 bg-[#F7F7FB]">
      {/* Header */}
      <View className="rounded-b-[36px] overflow-hidden">
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-8 px-6"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-[26px] font-poppins-bold">
                Notifications
              </Text>
              <Text className="text-white/70 text-[14px] mt-1 font-poppins">
                Stay updated with your finances
              </Text>
            </View>

            {unreadCount > 0 && (
              <View className="bg-white/20 rounded-full px-3.5 py-2 items-center justify-center">
                <Text className="text-white font-poppins-bold text-[13px]">
                  {unreadCount} new
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#8B5CF6"
          />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        ListEmptyComponent={() => (
          <View className="items-center mt-20 px-8">
            <View className="w-24 h-24 rounded-full bg-violet-50 items-center justify-center">
              <Icon
                name="notifications-off-outline"
                size={40}
                color="#A855F7"
              />
            </View>

            <Text className="mt-6 text-xl font-poppins-bold text-gray-900">
              No notifications
            </Text>

            <Text className="text-gray-400 mt-2 text-center text-[14px] font-poppins leading-6">
              Budget alerts, AI insights and expense updates will appear here.
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const color = notificationColors[item.type] ?? "#8B5CF6";

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (!item.isRead) markNotificationRead(item.id);
              }}
              className="flex-row bg-white rounded-[22px] mx-5 mt-3 overflow-hidden"
              style={cardShadow}
            >
              {/* Unread accent bar */}
              <View
                style={{
                  width: 4,
                  backgroundColor: item.isRead ? "transparent" : color,
                }}
              />

              <View className="flex-1 flex-row p-4">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon
                    name={notificationIcons[item.type] ?? "notifications"}
                    size={22}
                    color={color}
                  />
                </View>

                <View className="flex-1 ml-3.5">
                  <View className="flex-row items-start justify-between">
                    <Text
                      numberOfLines={1}
                      className={`text-[15px] flex-1 ${
                        item.isRead
                          ? "font-poppins-medium text-gray-700"
                          : "font-poppins-bold text-gray-900"
                      }`}
                    >
                      {item.title}
                    </Text>

                    {!item.isRead && (
                      <View className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 ml-2" />
                    )}
                  </View>

                  <Text
                    numberOfLines={2}
                    className="text-gray-400 text-[13px] mt-1 font-poppins leading-5"
                  >
                    {item.body}
                  </Text>

                  <Text className="text-gray-300 text-[11px] mt-2 font-poppins-medium">
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

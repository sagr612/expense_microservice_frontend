import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // ✅ Fixed: added undefined as initial value
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >(undefined);

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // ✅ Fixed: consistent spelling throughout
  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined,
  );
  const isNavigatingRef = useRef(false);

  const router = useRouter();

  // ✅ Fixed: closing brace was missing — handleNotificationResponse
  //    was accidentally nested inside this function before
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      try {
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        console.log("Expo Push Token:", token);
      } catch (error) {
        console.error("Error getting push token:", error);
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    }
  } // ✅ Fixed: this closing brace was missing

  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (isNavigatingRef.current) return;

      const data = response.notification.request.content.data;

      if (!data?.screen) return;

      isNavigatingRef.current = true;

      try {
        router.push({
          pathname: data.screen as any, // ✅ Fixed: cast to avoid strict route type error
          params: { ...(data.params as object) }, // ✅ Fixed: cast so spread works
        });
      } catch (error) {
        console.error("Error handling notification tap:", error);
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router],
  ); // ✅ Fixed: closing ) was missing here

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    return () => {
      // ✅ Fixed: newer expo-notifications uses .remove() not removeNotificationSubscription
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [handleNotificationResponse]); // ✅ Fixed: removed checkForInitialNotification (doesn't exist)

  return {
    expoPushToken,
    notification,
  };
};

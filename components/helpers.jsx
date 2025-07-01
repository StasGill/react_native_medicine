import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const getLocalData = async (key) => {
  try {
    const saved = await AsyncStorage.getItem(key);
    const parsedData = await JSON.parse(saved);

    if (parsedData) {
      return parsedData;
    }
  } catch (e) {
    console.log("Ошибка загрузки:", e);
  }
};

export const saveLocalData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const testNotification = async (msg) => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("emergency-channel", {
      name: "Emergency Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      sound: Platform.OS === "ios" ? "emergency" : "emergency.wav", // must match registered sound
    });
  }
  const channels = await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Напоминание о приёме",
      body: `Пора принять: таблетку)`,
      sound: "emergency.wav",
    },
    trigger: {
      type: "date",
      date: new Date(Date.now() + 60 * 1000),
      channelId: Platform.OS === "android" ? "emergency-channel" : undefined,
    }, // fire immediately
  });
};

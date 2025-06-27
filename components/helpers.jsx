import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

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
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💊 Напоминание о приёме",
      body: `Пора принять: таблетку)`,
    },
    trigger: { type: "date", date: new Date(Date.now() + 60 * 1000) }, // fire immediately
  });
};

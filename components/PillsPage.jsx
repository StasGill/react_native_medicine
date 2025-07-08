import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AddMedicineModal from "../components/ui/AddMedicineModal";
import CustomCalendar from "../components/ui/Calendar";
import { getLocalData, saveToLocalData } from "./helpers";

const timeOrder = { Утро: 1, День: 2, Вечер: 3 };

const PillScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [medsByDate, setMedsByDate] = useState({});
  const [selectedMed, setSelectedMed] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedTime, setEditedTime] = useState("Утро");
  const { date } = useSelector((state) => state.notification);
  const medsNew = useSelector((state) => state.medicine);

  const theme = useColorScheme();
  const styles = getStyles(theme);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const toggleTaken = (id) => {
    const updatedList = medsByDate[selectedDate].map((med) =>
      med.id === id ? { ...med, ...selectedMed, taken: !med.taken } : med
    );

    const newData = {
      ...medsByDate,
      [selectedDate]: updatedList,
    };

    setMedsByDate(newData);
    setSelectedMed(null);
  };

  useEffect(() => {
    const loadMeds = async () => {
      try {
        const saved = await getLocalData("meds");

        console.log("saved", saved);
        if (saved) {
          setMedsByDate(saved);
        }
      } catch (e) {
        console.log("Ошибка загрузки:", e);
      }
    };
    loadMeds();

    const registerNotifications = async () => {
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const request = await Notifications.requestPermissionsAsync();
        status = request.status;
      }
      if (status !== "granted") return; // Exit if denied

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };

    registerNotifications();
  }, []);

  useEffect(() => {
    saveToLocalData("meds", medsByDate);
  }, [medsByDate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💊 Таблетница 💊</Text>
        <CustomCalendar
          handleDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        <AddMedicineModal
          addModalVisible={addModalVisible}
          setAddModalVisible={setAddModalVisible}
          setMedsByDate={setMedsByDate}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {medsByDate[date]
          ?.slice()
          ?.sort((a, b) => {
            return timeOrder[a.times] - timeOrder[b.times];
          })
          ?.map((item) => (
            <View
              key={item.id}
              style={[styles.card, item.taken && styles.cardTaken]}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedMed(item);
                  setEditedName(item.name);
                  setEditedTime(item.time);
                  setSelectedMed(item);
                }}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <View style={styles.info}>
                  <Text
                    style={[styles.time, item.taken && { color: "#C8E6C9" }]}
                  >
                    {item.times} : {item.quantity}
                  </Text>
                  <Text
                    style={[styles.name, item.taken && { color: "#ffffff" }]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleTaken(item.id)}>
                <Ionicons
                  name={item.taken ? "checkmark-circle" : "ellipse-outline"}
                  size={28}
                  color={item.taken ? "#FFFFFF" : "#B0BEC5"}
                />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addText}>+ Добавить препарат</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PillScreen;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
      paddingTop: 40,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#E0E0E0",
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme === "dark" ? "#F5F5F5" : "#1F2937",
      textAlign: "center",
      paddingBottom: 12,
    },
    headerDate: {
      fontSize: 16,
      color: theme === "dark" ? "#B0BEC5" : "#6B7280",
    },
    scrollContainer: {
      padding: 16,
      paddingBottom: 10,
    },
    card: {
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
      padding: 16,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      shadowColor: theme === "dark" ? "white" : "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    cardTime: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#E0E0E0" : "#1F2937",
    },
    cardDose: {
      fontSize: 14,
      color: theme === "dark" ? "#9E9E9E" : "#6B7280",
    },
    cardIndex: {
      fontSize: 16,
      fontWeight: "500",
      color: "#007AFF",
    },
    addButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 16,
      margin: 16,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: Platform.OS === "android" ? 20 : 60,
    },
    addText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    cardTaken: {
      backgroundColor: "#4CAF50", // зелёный фон
    },
    info: {
      flexDirection: "column",
    },
    time: {
      fontSize: 14,
      color: "#90A4AE",
      marginBottom: 4,
    },
    name: {
      fontSize: 18,
      fontWeight: "500",
      color: theme === "dark" ? "white" : "#37474F",
    },
  });

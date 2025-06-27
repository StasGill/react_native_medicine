import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import uuid from "react-native-uuid";
import CustomInput from "../components/ui/CustomInput";
import { saveLocalData } from "./helpers";

const timeOrder = { Утро: 1, День: 2, Вечер: 3 };

const MedicationScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [newMedName, setNewMedName] = useState("");
  const [newMedQuantity, setNewMedQuantity] = useState("1 таблетка");
  const [medDuration, setMedDuration] = useState(1);
  const [hourMap, setHourMap] = useState({
    Утро: 9,
    День: 13,
    Вечер: 18,
  });
  const [minuteMap, setMinuteMap] = useState({
    Утро: 0,
    День: 0,
    Вечер: 0,
  });

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [selectedMed, setSelectedMed] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedTime, setEditedTime] = useState("Утро");
  const [newMedTimes, setNewMedTimes] = useState(["Утро"]);
  const [medsByDate, setMedsByDate] = useState({});

  const markedDates = Object.keys(medsByDate).reduce((acc, date) => {
    if (medsByDate[date] && medsByDate[date].length > 0) {
      acc[date] = {
        marked: true,
        dotColor: "#4CAF50", // зелёная точка или любой другой цвет
        activeOpacity: 0,
      };
    }
    return acc;
  }, {});

  const scheduleNotification = async (title, dateStr, timeLabel) => {
    const hour = hourMap[timeLabel];
    const minute = minuteMap[timeLabel];
    const triggerDate = new Date(
      `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:00`
    );
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Напоминание о приёме",
        body: `Пора принять: ${title} (${timeLabel})`,
      },
      trigger: { type: "date", date: triggerDate }, // fire immediately
    });
  };

  const handleAddMed = () => {
    if (newMedName.trim()) {
      const today = selectedDate;

      const dateList = Array.from({ length: medDuration }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0]; // формат: YYYY-MM-DD
      });

      setMedsByDate((prev) => {
        const updated = { ...prev };

        dateList.forEach((dateStr) => {
          newMedTimes.forEach((timeLabel) => {
            const newMed = {
              id: uuid.v4(),
              name: newMedName,
              quantity: newMedQuantity,
              duration: medDuration,
              times: [timeLabel],
              taken: false,
            };

            const dayList = updated[dateStr] || [];
            updated[dateStr] = [...dayList, newMed];
            scheduleNotification(newMedName, dateStr, timeLabel);
          });
        });

        saveMeds(updated);
        return updated;
      });

      // Очистка полей
      setAddModalVisible(false);
      setNewMedName("");
      setNewMedTimes(["Утро"]);
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
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

  const saveEditedMed = () => {
    const updatedList = medsByDate[selectedDate].map((med) =>
      med.id === selectedMed.id
        ? { ...med, ...selectedMed, name: editedName }
        : med
    );

    const newData = {
      ...medsByDate,
      [selectedDate]: updatedList,
    };

    setMedsByDate(newData);
    setSelectedMed(null);
  };

  const deleteMed = () => {
    const updated = medsByDate[selectedDate].filter(
      (med) => med.id !== selectedMed.id
    );
    const updatedObject = { ...medsByDate, [selectedDate]: updated };

    setMedsByDate(updatedObject);

    setSelectedMed(null);
  };

  useEffect(() => {
    const loadMeds = async () => {
      try {
        const saved = await AsyncStorage.getItem("@medsByDate");

        if (saved) {
          setMedsByDate(JSON.parse(saved));
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

  const saveMeds = async () => {
    try {
      await AsyncStorage.setItem("@medsByDate", JSON.stringify(medsByDate));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    saveLocalData("@medsByDate", medsByDate);
  }, [medsByDate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.header}>💊 Таблетница 💊</Text>
      </View>
      {/* Кнопка выбора даты */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.dateText}>Календарь :</Text>
        <Text style={styles.dateText}>
          {new Date(selectedDate).toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
      </TouchableOpacity>

      {/* Модальное окно с календарем */}
      <Modal visible={calendarVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={markedDates}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCalendarVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Модальное окно добавить препарат */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
              Новый препарат
            </Text>
            <CustomInput
              name="Название:"
              value={newMedName}
              onChange={setNewMedName}
              placeholder="Введите название"
            />
            <CustomInput
              name="Количество препарата для приема:"
              value={newMedQuantity}
              onChange={setNewMedQuantity}
              placeholder="2 таблетки"
            />
            <CustomInput
              name="Длительность приема дней:"
              value={medDuration}
              onChange={setMedDuration}
              placeholder="1"
              keyboardType="numeric"
            />

            <Text style={{ marginBottom: 4 }}>Время приёма:</Text>
            {["Утро", "День", "Вечер"].map((option) => {
              const isSelected = newMedTimes.includes(option);

              return (
                <TouchableOpacity
                  key={option}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    backgroundColor: isSelected ? "#1976D2" : "#ECEFF1",
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                  onPress={() => {
                    if (isSelected) {
                      setNewMedTimes(newMedTimes.filter((t) => t !== option));
                    } else {
                      setNewMedTimes([...newMedTimes, option]);
                    }
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? "#fff" : "#263238",
                      fontWeight: "500",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.closeButton} onPress={handleAddMed}>
              <Text style={styles.closeButtonText}>Сохранить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: "#ccc", marginTop: 8 },
              ]}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: "#333" }]}>
                Отмена
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={!!selectedMed} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
              Редактировать препарат
            </Text>

            <Text style={{ marginBottom: 6 }}>Название:</Text>
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={saveEditedMed}
            >
              <Text style={styles.closeButtonText}>Сохранить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: "#F44336", marginTop: 8 },
              ]}
              onPress={deleteMed}
            >
              <Text style={styles.closeButtonText}>Удалить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: "#ccc", marginTop: 8 },
              ]}
              onPress={() => setSelectedMed(null)}
            >
              <Text style={[styles.closeButtonText, { color: "#333" }]}>
                Отмена
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {medsByDate[selectedDate]
        ?.slice()
        .sort((a, b) => {
          return timeOrder[a.times] - timeOrder[b.times];
        })
        ?.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              item.taken && styles.cardTaken, // применяем зелёный стиль, если принято
            ]}
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
                <Text style={[styles.time, item.taken && { color: "#C8E6C9" }]}>
                  {item.times} : {item.quantity}
                </Text>
                <Text style={[styles.name, item.taken && { color: "#ffffff" }]}>
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addText}>+ Добавить препарат</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 280,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: "#263238",
  },
  dateButton: {
    backgroundColor: "#FFCC80",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#37474F",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    color: "#37474F",
  },
  addButton: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 100,
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardTaken: {
    backgroundColor: "#4CAF50", // зелёный фон
  },
});

export default MedicationScreen;

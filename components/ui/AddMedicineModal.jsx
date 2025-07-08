import { addMedicine } from "@/store/slices/medicineSlice";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { saveToLocalData } from "../helpers";
import CustomInput from "./CustomInput";

const AddMedicineModal = ({
  addModalVisible,
  setAddModalVisible,
  setMedsByDate,
}) => {
  const [newMedName, setNewMedName] = useState("");
  const [newMedQuantity, setNewMedQuantity] = useState("1 таблетка");
  const [medDuration, setMedDuration] = useState(1);
  const [newMedTimes, setNewMedTimes] = useState(["Утро"]);
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
  //   const [medsByDate, setMedsByDate] = useState({});
  const { date } = useSelector((state) => state.notification);
  const medsNew = useSelector((state) => state.medicine);
  const dispatch = useDispatch();

  const scheduleNotification = async (title, dateStr, timeLabel, newMed) => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("emergency-channel", {
        name: "Emergency Alerts",
        importance: Notifications.AndroidImportance.HIGH,
        sound: Platform.OS === "ios" ? "emergency" : "emergency.wav", // must match registered sound
      });
    }

    const hour = hourMap[timeLabel];
    const minute = minuteMap[timeLabel];
    let triggerDate;

    triggerDate = new Date(
      `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:00`
    );
    try {
      const notID = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Напоминание о приёме",
          body: `Пора принять: ${title} (${timeLabel})`,
          sound: "emergency.wav",
        },
        trigger: {
          type: "date",
          date: triggerDate,
          channelId:
            Platform.OS === "android" ? "emergency-channel" : undefined,
        },
      });
      newMed.notificationID = notID;
    } catch (error) {
      console.error("❌ Notification scheduling failed:", error);
    }
  };

  const handleAddMed = () => {
    if (newMedName.trim()) {
      const today = date;

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
              notificationID: null,
            };

            const dayList = updated[dateStr] || [];
            updated[dateStr] = [...dayList, newMed];
            scheduleNotification(newMedName, dateStr, timeLabel, newMed);
            console.log(newMed);
          });
        });

        saveToLocalData("meds", updated);
        // console.log("inside", updated);
        dispatch(addMedicine(updated));
        return updated;
      });

      // Очистка полей
      setAddModalVisible(false);
      setNewMedName("");
      setNewMedTimes(["Утро"]);
    }
  };

  return (
    <Modal visible={addModalVisible} animationType="fade" transparent>
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
            onPress={() => {
              setAddModalVisible(false);
              console.log(medsNew);
            }}
          >
            <Text style={[styles.closeButtonText, { color: "#333" }]}>
              Отмена
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddMedicineModal;

const styles = StyleSheet.create({
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
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});

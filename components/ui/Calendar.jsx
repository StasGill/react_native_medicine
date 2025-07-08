import { dateNotification } from "@/store/slices/notificationSlice";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";

const CustomCalendar = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [medsByDate, setMedsByDate] = useState({});
  const { date } = useSelector((state) => state.notification);

  const dispatch = useDispatch();

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

  const handlePress = (e) => {
    dispatch(dateNotification(e.dateString));
    setCalendarVisible(false);
  };

  // useEffect(() => {
  //   console.log(date);
  // }, [date]);

  return (
    <>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.dateText}>Календарь :</Text>
        <Text style={styles.dateText}>
          {new Date(date).toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
      </TouchableOpacity>
      <Modal visible={calendarVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Calendar onDayPress={handlePress} markedDates={markedDates} />
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
    </>
  );
};

export default CustomCalendar;

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
  dateButton: {
    backgroundColor: "#FFCC80",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#37474F",
  },
});

import {
  hourNotification,
  minuteNotification,
} from "@/store/slices/notificationSlice";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { getLocalData, saveLocalData, testNotification } from "./helpers";
import CustomInput from "./ui/CustomInput";

export const SettingPage = () => {
  const [morning, setMorning] = useState(8);
  const [afternoon, setAfternoon] = useState(13);
  const [evening, setEvening] = useState(19);
  const [morningM, setMorningM] = useState(0);
  const [afternoonM, setAfternoonM] = useState(0);
  const [eveningM, setEveningM] = useState(0);
  const [testFunction, setTestFunction] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getLocalData("hourMap").then((item) => {
      setMorning(item.Утро);
      setAfternoon(item.День);
      setEvening(item.Вечер);
    });
    getLocalData("minuteMap").then((item) => {
      setMorningM(item.Утро);
      setAfternoonM(item.День);
      setEveningM(item.Вечер);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centered}>
        <TouchableOpacity onLongPress={() => setTestFunction(!testFunction)}>
          <Text style={styles.header}>Настройки</Text>
        </TouchableOpacity>
        {/* <Text style={styles.text}>Задать время для уведомлений</Text> */}
        <View style={styles.modalContainer}>
          <Text style={styles.alter_text}>
            Задать время для уведомлений утром
          </Text>
          <View style={styles.row}>
            <CustomInput
              name="Часов"
              value={morning}
              onChange={setMorning}
              placeholder="Часов"
              keyboardType="numeric"
            />
            <CustomInput
              name="Минут"
              value={morningM}
              onChange={setMorningM}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.alter_text}>
            Задать время для уведомлений в обед
          </Text>
          <View style={styles.row}>
            <CustomInput
              name="Часов"
              value={afternoon}
              onChange={setAfternoon}
              placeholder="Часов"
              keyboardType="numeric"
            />
            <CustomInput
              name="Минут"
              value={afternoonM}
              onChange={setAfternoonM}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.alter_text}>
            Задать время для уведомлений вечером
          </Text>
          <View style={styles.row}>
            <CustomInput
              name="Часов"
              value={evening}
              onChange={setEvening}
              placeholder="Часов"
              keyboardType="numeric"
            />
            <CustomInput
              name="Минут"
              value={eveningM}
              onChange={setEveningM}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              saveLocalData("hourMap", {
                Утро: morning,
                День: afternoon,
                Вечер: evening,
              });
              saveLocalData("minuteMap", {
                Утро: morningM,
                День: afternoonM,
                Вечер: eveningM,
              });
              dispatch(
                hourNotification({
                  Утро: morning,
                  День: afternoon,
                  Вечер: evening,
                })
              );
              dispatch(
                minuteNotification({
                  Утро: morningM,
                  День: afternoonM,
                  Вечер: eveningM,
                })
              );
            }}
          >
            <Text style={styles.closeButtonText}>Сохранить</Text>
          </TouchableOpacity>
          {testFunction && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={testNotification}
            >
              <Text>Test</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
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
  text: { fontSize: 22 },
  alter_text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginTop: 10,
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

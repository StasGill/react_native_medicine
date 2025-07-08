import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { getLocalData, saveToLocalData, testNotification } from "./helpers";
import CustomInput from "./ui/CustomInput";

export const SettingPage = () => {
  const [morning, setMorning] = useState(8);
  const [afternoon, setAfternoon] = useState(13);
  const [evening, setEvening] = useState(19);
  const [morningM, setMorningM] = useState(0);
  const [afternoonM, setAfternoonM] = useState(0);
  const [eveningM, setEveningM] = useState(0);
  const [testFunction, setTestFunction] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const theme = useColorScheme();
  const styles = getStyles(theme);

  const dispatch = useDispatch();

  const handleSave = () => {
    setIsSaved(true);
    Vibration.vibrate(500);
    saveToLocalData("timing", {
      hour: { Утро: morning, День: afternoon, Вечер: evening },
      minute: { Утро: morningM, День: afternoonM, Вечер: eveningM },
    });

    // dispatch(
    //   hourNotification({
    //     Утро: morning,
    //     День: afternoon,
    //     Вечер: evening,
    //   })
    // );
    // dispatch(
    //   minuteNotification({
    //     Утро: morningM,
    //     День: afternoonM,
    //     Вечер: eveningM,
    //   })
    // );
    setTimeout(() => {
      setIsSaved(false);
    }, "2000");
  };

  useEffect(() => {
    getLocalData("timing").then((item) => {
      setMorning(item.hour.Утро);
      setAfternoon(item.hour.День);
      setEvening(item.hour.Вечер);
      setMorningM(item.minute.Утро);
      setAfternoonM(item.minute.День);
      setEveningM(item.minute.Вечер);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centered}>
        <TouchableOpacity onLongPress={() => setTestFunction(!testFunction)}>
          <Text style={styles.header}>Настройки</Text>
        </TouchableOpacity>
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
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
            <CustomInput
              name="Минут"
              value={morningM}
              onChange={setMorningM}
              placeholder="0"
              keyboardType="numeric"
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
          </View>
          <Text style={styles.alter_text}>В обед</Text>
          <View style={styles.row}>
            <CustomInput
              name="Часов"
              value={afternoon}
              onChange={setAfternoon}
              placeholder="Часов"
              keyboardType="numeric"
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
            <CustomInput
              name="Минут"
              value={afternoonM}
              onChange={setAfternoonM}
              placeholder="0"
              keyboardType="numeric"
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
          </View>
          <Text style={styles.alter_text}>Вечером</Text>
          <View style={styles.row}>
            <CustomInput
              name="Часов"
              value={evening}
              onChange={setEvening}
              placeholder="Часов"
              keyboardType="numeric"
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
            <CustomInput
              name="Минут"
              value={eveningM}
              onChange={setEveningM}
              placeholder="0"
              keyboardType="numeric"
              styles={{
                width: 100,
                color: theme === "dark" ? "#F5F5F5" : "#1F2937",
              }}
            />
          </View>
          {isSaved ? (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleSave}
            >
              <Text style={styles.closeButtonText}>Сохранено</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.closeButton} onPress={handleSave}>
              <Text style={styles.closeButtonText}>Сохранить</Text>
            </TouchableOpacity>
          )}

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

const getStyles = (theme) =>
  StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    row: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 12,
    },
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 280,
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 12,
      color: theme === "dark" ? "#F5F5F5" : "#1F2937",
    },
    text: { fontSize: 22 },
    alter_text: {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 12,
      color: theme === "dark" ? "#F5F5F5" : "#1F2937",
    },
    modalContainer: {
      backgroundColor: theme === "dark" ? "grey" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      width: "100%",
      marginTop: 10,
      color: theme === "dark" ? "#F5F5F5" : "#1F2937",
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
    completeButton: {
      marginTop: 10,
      backgroundColor: "green",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
  });

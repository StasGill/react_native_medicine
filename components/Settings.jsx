import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getLocalData, saveLocalData } from "./MedicationPage";
import CustomInput from "./ui/CustomInput";

const minuteMap = {
  Утро: 0,
  День: 0,
  Вечер: 0,
};

export const SettingPage = () => {
  const [morning, setMorning] = useState(8);
  const [afternoon, setAfternoon] = useState(13);
  const [evening, setEvening] = useState(19);

  useEffect(() => {
    getLocalData("hourMap").then((item) => {
      setMorning(item.Утро);
      setAfternoon(item.День);
      setEvening(item.Вечер);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.header}>Настройки</Text>
        <Text style={styles.text}>Задать время для уведомлений</Text>
        <View style={styles.modalContainer}>
          <CustomInput
            name="Уведомления утром"
            value={morning}
            onChange={setMorning}
            placeholder="8"
            keyboardType="numeric"
          />
          <CustomInput
            name="Уведомления в обед"
            value={afternoon}
            onChange={setAfternoon}
            placeholder="13"
            keyboardType="numeric"
          />
          <CustomInput
            name="Уведомления вечером"
            value={evening}
            onChange={setEvening}
            placeholder="19"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>
              saveLocalData("hourMap", {
                Утро: morning,
                День: afternoon,
                Вечер: evening,
              })
            }
          >
            <Text style={styles.closeButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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

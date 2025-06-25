import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const medicationsByDate = {
  "2025-06-22": ["Аспирин 100мг", "Витамин D 1000ME"],
  "2025-06-23": ["Ибупрофен 200мг"],
  "2025-06-24": ["Метформин 500мг", "Магний В6"],
};

const MyCalendarWithList = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const medications = medicationsByDate[selectedDate] || [];

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#4CAF50",
            selectedTextColor: "#ffffff",
          },
        }}
      />

      <View style={styles.listContainer}>
        <Text style={styles.header}>
          Препараты на {selectedDate || "выберите дату"}:
        </Text>
        {medications.length > 0 ? (
          <FlatList
            data={medications}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
          />
        ) : (
          <Text style={styles.noMeds}>Нет назначений</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  noMeds: {
    fontSize: 16,
    fontStyle: "italic",
    color: "white",
  },
});

export default MyCalendarWithList;

import { StyleSheet } from "react-native";

import { SettingPage } from "../../components/Settings";

export default function TabTwoScreen() {
  return <SettingPage />;
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

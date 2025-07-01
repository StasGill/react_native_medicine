import { Text, TextInput, View } from "react-native";

export default function CustomInput({
  name,
  value,
  onChange,
  placeholder,
  keyboardType,
}) {
  return (
    <View>
      <Text style={{ marginBottom: 6 }}>{name}</Text>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
    </View>
  );
}

import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Settings</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 18 },
});
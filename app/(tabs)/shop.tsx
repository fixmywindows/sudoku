import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useGameStore } from "../../store/game-store";

export default function Shop() {
  const { points } = useGameStore();

  const handlePointsClick = () => {
    Alert.alert(
      "Your Points",
      `Wow, you've got ${points} points! Play more games to earn extra points or grab some sweet deals in the shop!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handlePointsClick}>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Shop (Coming Soon!)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  pointsText: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 18 },
});
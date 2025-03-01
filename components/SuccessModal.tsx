import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { useGameStore } from "../store/game-store";
import { useState, useEffect } from "react";
import Vibration from "react-native-vibration";
import { router } from "expo-router";

export default function SuccessModal() {
  const { gameWon, resetGame, points, size, gameTime, personalBest } = useGameStore();
  const [showOptions, setShowOptions] = useState(false);
  const reward = pointRewards[size] + (gameTime < personalBest[size] ? 10 : 0);

  useEffect(() => {
    if (gameWon) Vibration.vibrate(500);
  }, [gameWon]);

  if (!gameWon) return null;

  return (
    <>
      <Modal visible={!showOptions} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Congrats! Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, "0")}
            </Text>
            <Text style={styles.modalText}>
              You earned {reward} points{gameTime < personalBest[size] ? " (10 bonus for new best!)" : ""}. Total: {points} points.
            </Text>
            <Button title="Next" onPress={() => setShowOptions(true)} />
          </View>
        </View>
      </Modal>
      <Modal visible={showOptions} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Exit to Menu" onPress={() => { router.push("/(tabs)/index"); setShowOptions(false); }} />
            <Button title="Play Again" color="#007AFF" onPress={() => { resetGame(); setShowOptions(false); }} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const pointRewards = { 3: 10, 4: 15, 5: 20, 6: 25, 7: 30, 8: 35, 9: 40 };

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, marginBottom: 10 },
});
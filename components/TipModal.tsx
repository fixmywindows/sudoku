import { Modal, View, Text, Button, StyleSheet, Platform } from "react-native";
import { useGameStore } from "../store/game-store";
import * as Haptics from "expo-haptics"; // Replaced Vibration

interface TipModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TipModal({ visible, onClose }: TipModalProps) {
  const { points, useHint } = useGameStore();

  const handlePoints = () => {
    useHint();
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Updated
    onClose();
  };

  const handleAd = () => {
    // Placeholder for ad logic
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Updated
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Get a Tip!</Text>
          <Button title="Spend 30 Points" onPress={handlePoints} disabled={points < 30} />
          <Button title="Watch Ad" onPress={handleAd} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, marginBottom: 10 },
});
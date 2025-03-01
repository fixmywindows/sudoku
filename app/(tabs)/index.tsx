import { useGameStore, SudokuType, GridSize } from "../../store/game-store";
import { router } from "expo-router";
import { Button, SafeAreaView, StyleSheet, Text, View, Modal, Alert } from "react-native";
import { useState, useEffect } from "react";

export default function Index() {
  const { setTypeAndSize, unlockLevel, points, unlockedLevels, claimDailyReward } = useGameStore();
  const [showConfirm, setShowConfirm] = useState<{ type: SudokuType; size: GridSize } | null>(null);

  const sudokuTypes = [
    { name: "Numerical", type: "numerical" as const },
    { name: "Colour", type: "colour" as const },
    { name: "Emoji", type: "emoji" as const },
    { name: "Flags", type: "flags" as const },
  ];
  const sizes: GridSize[] = [3, 4, 5, 6, 7, 8, 9];
  const unlockCosts: Record<GridSize, number> = { 3: 0, 4: 10, 5: 20, 6: 30, 7: 40, 8: 50, 9: 60 };

  useEffect(() => {
    claimDailyReward();
  }, []);

  const handleLevelPress = (type: SudokuType, size: GridSize) => {
    if (unlockedLevels[type as keyof typeof unlockedLevels].includes(size)) {
      setTypeAndSize(type, size);
      router.push("/game");
    } else {
      setShowConfirm({ type, size });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      {sudokuTypes.map((sudoku) => (
        <View key={sudoku.type} style={styles.typeContainer}>
          <Text style={styles.typeTitle}>{sudoku.name}</Text>
          {sizes.map((size) => (
            <Button
              key={size}
              title={`${size}x${size}${unlockedLevels[sudoku.type as keyof typeof unlockedLevels].includes(size) ? "" : " (Locked)"}`}
              onPress={() => handleLevelPress(sudoku.type, size)}
              color={unlockedLevels[sudoku.type as keyof typeof unlockedLevels].includes(size) ? "#000" : "#888"}
            />
          ))}
        </View>
      ))}
      <Modal visible={!!showConfirm} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Unlock {showConfirm?.size}x{showConfirm?.size} {sudokuTypes.find(t => t.type === showConfirm?.type)?.name} for {unlockCosts[showConfirm?.size || 3]} points?</Text>
            <Button
              title="Confirm"
              onPress={() => {
                if (showConfirm && unlockLevel(showConfirm.type, showConfirm.size)) {
                  setShowConfirm(null);
                } else {
                  Alert.alert("Not enough points!");
                  setShowConfirm(null);
                }
              }}
            />
            <Button title="Cancel" onPress={() => setShowConfirm(null)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  typeContainer: { marginVertical: 10, alignItems: "center" },
  typeTitle: { fontSize: 18, marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
});
import { useGameStore, Cell } from "../store/game-store";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, Button, Platform } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics"; // Replaced Vibration
import SuccessModal from "../components/SuccessModal";
import TipModal from "../components/TipModal";

export default function Game() {
  const { grid, setNumber, checkGame, type, size, mistakes, useHint } = useGameStore();
  const [selectedCell, setSelectedCell] = useState<null | { row: number; col: number }>(null);
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => useGameStore.getState().updateTime(), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mistakes > 0 && Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Updated
  }, [mistakes]);

  const renderCellValue = (cell: Cell) => {
    if (type === "numerical") return cell === 0 ? "" : cell;
    if (type === "colour") return <View style={{ backgroundColor: cell as string || "transparent", width: 20, height: 20 }} />;
    if (type === "emoji") return cell || "";
    if (type === "flags") return cell ? String.fromCodePoint(parseInt(cell as string, 16)) : "";
  };

  const inputOptions = type === "numerical" ? [1, 2, 3, 4, 5, 6, 7, 8, 9] :
                      type === "colour" ? ["red", "blue", "green", "yellow"] :
                      type === "emoji" ? ["😊", "⭐", "🌟", "💖"] :
                      ["1F1E6", "1F1E7", "1F1E8", "1F1E9"];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={grid}
        renderItem={({ item: row, index: rowIndex }) => (
          <View style={styles.row}>
            {row.map((cell: Cell, colIndex: number) => (
              <TouchableOpacity
                key={colIndex}
                onPress={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                style={[
                  styles.cell,
                  { width: 300 / size, height: 300 / size },
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? styles.selectedCell : null,
                ]}
              >
                <Text style={styles.cellText}>{renderCellValue(cell)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={styles.numberPad}>
        {inputOptions.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => {
              if (selectedCell) {
                setNumber(selectedCell.row, selectedCell.col, value);
                checkGame();
              }
            }}
            style={styles.numberButton}
          >
            <Text style={styles.numberText}>{type === "colour" ? <View style={{ backgroundColor: value as string, width: 20, height: 20 }} /> : value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Tip" onPress={() => setShowTipModal(true)} />
      <SuccessModal />
      <TipModal visible={showTipModal} onClose={() => setShowTipModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row" },
  cell: { borderWidth: 1, borderColor: "#000", alignItems: "center", justifyContent: "center" },
  selectedCell: { backgroundColor: "#ddd" },
  cellText: { fontSize: 18 },
  numberPad: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
  numberButton: { padding: 10, margin: 5, backgroundColor: "#eee" },
  numberText: { fontSize: 18 },
});
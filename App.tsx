import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

// Expo Router handles routing via app/ directory, no Router component needed
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {/* Routing is managed by Expo Router via app/ files */}
    </View>
  );
}
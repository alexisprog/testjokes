import { StyleSheet } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { Text } from "react-native-paper";

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
        <Text variant="titleLarge" style={styles.title}> 
          Favoritos
        </Text>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 26,
    textAlign: "center",
  },
});

import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { Joke } from "@/src/services/api";

interface JokeItemProps {
  joke: Joke;
}

export const JokeItem = React.memo(({ joke }: JokeItemProps) => {
  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="labelLarge" style={styles.category}>
        {joke.categories.length > 0
          ? joke.categories.join(", ")
          : "Sin categoría"}
      </Text>
      <Text variant="bodyMedium" style={styles.jokeText}>
        {joke.value}
      </Text>
    </Surface>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  category: {
    marginBottom: 8,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  jokeText: {
    lineHeight: 20,
  },
});

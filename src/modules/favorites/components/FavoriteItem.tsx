import * as React from "react";
import { StyleSheet, Animated } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { Joke } from "@/src/services/api";

interface FavoriteItemProps {
  joke: Joke;
  onRemove: (id: string) => void;
}

export const FavoriteItem = React.memo(
  ({ joke, onRemove }: FavoriteItemProps) => {
    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <IconButton
            icon="delete"
            mode="contained"
            containerColor="red"
            iconColor="white"
            size={24}
            onPress={() => onRemove(joke.id)}
          />
        </Animated.View>
      );
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        rightThreshold={40}
        friction={2}
      >
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
      </Swipeable>
    );
  }
);

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
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
});

import React from "react";
import { StyleSheet, Animated, View } from "react-native";
import { Surface, Text, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { Joke } from "@/src/services/api";
import { Share } from "react-native";
import { useColorScheme } from "@/src/hooks/useColorScheme";

interface FavoriteItemProps {
  joke: Joke;
  onRemove: (id: string) => void;
}

export const FavoriteItem = React.memo(
  ({ joke, onRemove }: FavoriteItemProps) => {
    const { theme } = useColorScheme();

    const handleShare = async () => {
      try {
        const message = `${joke.value}\n\n${
          joke.categories.length > 0
            ? `Categorías: ${joke.categories.join(", ")}`
            : "Sin categoría"
        }`;

        await Share.share({
          message,
          title: "Compartir chiste de Chuck Norris",
        });
      } catch (error) {
        console.error("Error sharing joke:", error);
      }
    };

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
        <View style={styles.actionsContainer}>
          <Animated.View
            style={[
              styles.actionButton,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <IconButton
              icon="share-variant"
              mode="contained"
              containerColor={theme.colors.tertiary}
              iconColor={theme.colors.background}
              size={24}
              onPress={handleShare}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.actionButton,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <IconButton
              icon="delete"
              mode="contained"
              containerColor={theme.colors.onErrorContainer}
              iconColor={theme.colors.background}
              size={24}
              onPress={() => onRemove(joke.id)}
            />
          </Animated.View>
        </View>
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "100%",
  },
});

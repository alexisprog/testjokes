import * as React from "react";
import { Portal, Dialog, Button, Text, IconButton } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Joke } from "@/src/services/api";
import { useCategoriesStore } from "@/src/store/useCategoriesStore";

interface JokeDialogProps {
  visible: boolean;
  onDismiss: () => void;
  joke: Joke | null;
}

export const JokeDialog = ({ visible, onDismiss, joke }: JokeDialogProps) => {
  const { addToFavorites, removeFromFavorites, isJokeFavorite } =
    useCategoriesStore();

  if (!joke) return null;

  const isFavorite = isJokeFavorite(joke.id);

  const handleFavoritePress = async () => {
    if (isFavorite) {
      await removeFromFavorites(joke.id);
    } else {
      await addToFavorites(joke);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="emoticon" />
        <Dialog.Title>{`Chuck Norris Joke ${joke.categories.join(
          ", "
        )}`}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{joke.value}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <View style={styles.actionsContainer}>
            <Button
              mode="text"
              onPress={handleFavoritePress}
              icon={isFavorite ? "heart" : "heart-outline"}
            >
              {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            </Button>
            <Button onPress={onDismiss}>Cerrar</Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

import * as React from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";
import { Joke } from "@/src/services/api";

interface JokeDialogProps {
  visible: boolean;
  onDismiss: () => void;
  joke: Joke | null;
}

export const JokeDialog = ({ visible, onDismiss, joke }: JokeDialogProps) => {
  if (!joke) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="emoticon" />
        <Dialog.Title>Chuck Norris Joke</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{joke.value}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cerrar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

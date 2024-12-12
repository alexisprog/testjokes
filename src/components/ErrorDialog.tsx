import * as React from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";
import { useErrorStore } from "../store/useErrorStore";

export const ErrorDialog = () => {
  const { isVisible, message, hideError } = useErrorStore();

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideError}>
        <Dialog.Icon icon="alert" />
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideError}>Aceptar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

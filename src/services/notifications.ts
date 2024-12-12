import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configurar canal para Android
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

export const scheduleWelcomeNotification = async (joke: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Bienvenido a Chuck Norris Jokes! 💪",
        body: joke,
        data: { type: "welcome" },
      },
      trigger: {
        seconds: 2, // Mostrar después de 2 segundos
      },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

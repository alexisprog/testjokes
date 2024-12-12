import { useEffect } from "react";
import { Slot } from "expo-router";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaWrapper } from "@/src/components/SafeAreaWrapper";
import { ErrorDialog } from "@/src/components/ErrorDialog";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemedView } from "@/src/components/ThemedView";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
import { useAuthStore } from "@/src/store/useAuthStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log("onAuthStateChanged", user);
    useAuthStore.setState({
      user,
      isAuthenticated: !!user,
    });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }
    }
  }

  if (!loaded) {
    return (
      <ThemedView
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaWrapper>
            <Slot />
            <ErrorDialog />
          </SafeAreaWrapper>
        </GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

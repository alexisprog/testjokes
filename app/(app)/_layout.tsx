import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useAuthStore } from "@/src/store/useAuthStore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";

export default function AppLayout() {
  const [initializing, setInitializing] = useState(true);
  const { isAuthenticated } = useAuthStore();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log("onAuthStateChanged", user);
    useAuthStore.setState({
      user,
      isAuthenticated: !!user,
    });
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
      <Stack screenOptions={{ headerShown: false }} />
  );
}

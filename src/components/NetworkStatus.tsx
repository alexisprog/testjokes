import React from "react";
import { StyleSheet, Animated } from "react-native";
import { Text } from "react-native-paper";
import { useNetworkStore } from "@/src/store/useNetworkStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

export const NetworkStatus = () => {
  const isConnected = useNetworkStore((state) => state.isConnected);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (isConnected === false) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: -200,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  if (isConnected === null) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          top: insets.top,
        },
      ]}
    >
      <Text style={styles.text}>Sin conexión a Internet</Text>
      <Text style={styles.subText}>
        Verifica tu conexión para continuar usando la app
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#ff4444",
    padding: 16,
    zIndex: 999,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  subText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
});

import React from "react";
import { Tabs } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { CustomTabBar } from "@/src/components/ui/CustomTabBar";

export default function TabsLayout() {
  const { theme } = useColorScheme();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="rectangle-list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="favorite" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

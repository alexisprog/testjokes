import { View, StyleSheet, Platform } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme } = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
          height: 65 + insets.bottom,
        },
      ]}
      elevation={4}
    >
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Surface
              key={route.key}
              style={[
                styles.tab,
                isFocused && {
                  backgroundColor: theme.colors.secondaryContainer,
                },
              ]}
              mode={isFocused ? "elevated" : "flat"}
              elevation={isFocused ? 0 : 0}
            >
              <View
                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                onTouchEnd={onPress}
              >
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurface,
                  size: 24,
                })}
                <Text
                  variant="labelSmall"
                  style={[
                    styles.label,
                    {
                      color: isFocused
                        ? theme.colors.onSecondaryContainer
                        : theme.colors.onSurface,
                    },
                  ]}
                >
                  {label}
                </Text>
              </View>
            </Surface>
          );
        })}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    position: Platform.select({
      ios: "absolute",
      default: "relative",
    }),
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
  },
  tabBarContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "transparent",
    borderRadius: 32,
    padding: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  tabButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "transparent",
  },
});

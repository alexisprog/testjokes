import { View, type ViewProps } from "react-native";
import { useColorScheme } from "@/src/hooks/useColorScheme";

export function ThemedView({
  style,
  ...otherProps
}: ViewProps) {
  const {theme} = useColorScheme()

  const backgroundColor = theme.colors.background

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

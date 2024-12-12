/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "./useColorScheme";
import type { AppTheme } from "./useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof AppTheme["colors"]
) {
  const { theme } = useColorScheme();

  if (props.light && props.dark) {
    return theme.colors[colorName];
  } else {
    return theme.colors[colorName];
  }
}

import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { useTheme } from "../ThemeProvider";
import type { Theme } from "../tokens";

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subtitle"
  | "body"
  | "bodySm"
  | "caption"
  | "eyebrow";

export type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "inverse"
  | "accent"
  | "link"
  | "success"
  | "warning"
  | "danger";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: "400" | "500" | "600" | "700";
  align?: "auto" | "left" | "right" | "center" | "justify";
}

const toneColor = (theme: Theme, tone: TextTone): string => {
  const c = theme.color;
  switch (tone) {
    case "muted":
      return c.textMuted;
    case "subtle":
      return c.textSubtle;
    case "inverse":
      return c.textInverse;
    case "accent":
      return c.textAccent;
    case "link":
      return c.textLink;
    case "success":
      return c.success;
    case "warning":
      return c.warning;
    case "danger":
      return c.danger;
    default:
      return c.text;
  }
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  tone = "default",
  weight,
  align,
  style,
  ...rest
}) => {
  const { theme, typography } = useTheme();
  const scaleKey = variant === "eyebrow" ? "micro" : variant;
  const v = typography.scale[scaleKey as keyof typeof typography.scale];

  const baseStyle = {
    fontFamily: typography.family.sans,
    fontSize: v?.size,
    lineHeight: v.lineHeight,
    letterSpacing: v.letterSpacing,
    fontWeight: weight ?? v.weight,
    color: toneColor(theme, tone),
    textTransform: variant === "eyebrow" ? ("uppercase" as const) : undefined,
    textAlign: align,
  };

  return <RNText {...rest} style={[baseStyle, style]} />;
};

import { TextProps } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";

export function ScreenTitle({ children, style }: TextProps) {
  return (
    <ThemedText
      className={"font-inter-semibold text-3xl text-accent-100 pb-4"}
      style={style}
    >
      {children}
    </ThemedText>
  );
}

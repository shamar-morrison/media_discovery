import { Text, TextProps } from "react-native";
import React from "react";

export function ScreenTitle({ children, style }: TextProps) {
  return (
    <Text
      className={"font-inter-semibold text-3xl text-accent-100 px-2 pb-4"}
      style={style}
    >
      {children}
    </Text>
  );
}

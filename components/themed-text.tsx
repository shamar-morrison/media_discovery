import { Text, TextProps } from "react-native";
import React from "react";

export function ThemedText({ children, ...props }: TextProps) {
  return (
    <Text className={`text-white font-inter`} {...props}>
      {children}
    </Text>
  );
}

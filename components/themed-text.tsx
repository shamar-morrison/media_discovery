import { Text, TextProps } from "react-native";
import React from "react";

export function ThemedText({ children, className, ...props }: TextProps) {
  return (
    <Text className={`text-white font-inter ${className}`} {...props}>
      {children}
    </Text>
  );
}

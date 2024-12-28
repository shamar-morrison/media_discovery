import { Text, TextProps } from "react-native";
import React from "react";

export function ThemedText({ children, className, ...props }: TextProps) {
  return (
    <Text className={`leading-5 text-white font-rubik ${className}`} {...props}>
      {children}
    </Text>
  );
}

import { Text } from "react-native";
import React from "react";

type ThemedTextProps = {
  children: string;
  className?: string;
};

export function ThemedText({ children, className }: ThemedTextProps) {
  return (
    <Text className={`text-white font-rubik ${className}`}>{children}</Text>
  );
}

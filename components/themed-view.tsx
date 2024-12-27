import { View, Text, ViewProps } from "react-native";
import React from "react";

export function ThemedView({ children, className, ...props }: ViewProps) {
  return (
    <View className={`bg-black-200 h-full ${className}`} {...props}>
      {children}
    </View>
  );
}

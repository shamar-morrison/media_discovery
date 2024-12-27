import { View, Text, ViewProps } from "react-native";
import React from "react";

export function ThemedView({ children, className, ...props }: ViewProps) {
  return (
    <View className={`bg-black-200 h-full p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

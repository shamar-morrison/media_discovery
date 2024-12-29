import { View, Text, ViewProps } from "react-native";
import React from "react";

export function ThemedView({ children, className, ...props }: ViewProps) {
  return (
    <View className={`flex-1 bg-black-200 h-full p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

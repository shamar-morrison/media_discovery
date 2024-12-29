import { View, Text, ScrollView, ScrollViewProps } from "react-native";
import React from "react";

export function ThemedScrollView({
  children,
  className,
  ...props
}: ScrollViewProps) {
  return (
    <ScrollView className={"flex-1 bg-black-200 h-full"} {...props}>
      {children}
    </ScrollView>
  );
}

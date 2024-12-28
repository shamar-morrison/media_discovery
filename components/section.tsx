import { View, Text } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";

type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <View
      className={"bg-black-100 px-4 py-6 my-4"}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6,
      }}
    >
      <View className="flex flex-row gap-2 items-center">
        <View className={"h-6 w-2 rounded-lg bg-primary-300"} />
        <ThemedText className={"text-2xl font-inter-medium"}>
          {title}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

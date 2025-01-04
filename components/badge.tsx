import { View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";

type BadgeProps = {
  text: string;
  variant?: "default" | "red" | "green";
};

export function Badge({ text, variant = "default" }: BadgeProps) {
  return (
    <View
      className={`border-[0.4px] rounded-md py-1 px-2 w-max
      ${variant === "default" && "border-accent-100/20 bg-black-100"} 
      ${variant === "red" && "border-red-300 bg-red-400"} 
      ${variant === "green" && "border-green-300 bg-green-400"}`}
    >
      <ThemedText
        className={`text-xs tracking-wider uppercase font-inter-semibold
        ${variant === "default" && "opacity-50"} 
        ${variant === "red" && "text-red-100"}
        ${variant === "green" && "text-green-100"}`}
      >
        {text}
      </ThemedText>
    </View>
  );
}

import { TextProps } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import { ncn } from "@/utils/ncn";

export function ScreenTitle({ children, className, ...props }: TextProps) {
  return (
    <ThemedText
      className={ncn(
        "font-inter-semibold text-3xl text-accent-100 pb-4",
        className,
      )}
      {...props}
    >
      {children}
    </ThemedText>
  );
}

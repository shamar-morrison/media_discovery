import React from "react";
import { Stack } from "expo-router";

export function SharedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1D1D1D", flex: 1 },
      }}
    />
  );
}

import { View, Text } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function InitialSearchState() {
  return (
    <View
      className={
        "flex-1 mx-auto items-center justify-center h-full gap-3 text-accent-100"
      }
    >
      <Ionicons name={"search"} size={80} color={"#fff"} />
      <ThemedText
        className={
          "font-rubik-medium text-lg w-[250px] text-center text-accent-100"
        }
      >
        Search for movies, TV shows, or people.
      </ThemedText>
    </View>
  );
}

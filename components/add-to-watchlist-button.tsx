import React from "react";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddToWatchlistButton() {
  return (
    <Button>
      <Ionicons name={"add"} size={20} color={"#fff"} />
      <ThemedText>Add to Watchlist</ThemedText>
    </Button>
  );
}

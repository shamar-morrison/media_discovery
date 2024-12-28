import React from "react";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/button";

export default function PlayTrailerButton() {
  return (
    <Button variant={"outline"}>
      <Ionicons name={"play"} size={20} color={"#fff"} />
      <ThemedText>Play Trailer</ThemedText>
    </Button>
  );
}

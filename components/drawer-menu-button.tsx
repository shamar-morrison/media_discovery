import { TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";

export function DrawerMenuButton() {
  return (
    <TouchableOpacity className={"mt-[3px]"} hitSlop={hitSlop}>
      <Ionicons name="menu" size={27} color="#fff" className={"mr-2"} />
    </TouchableOpacity>
  );
}

import { TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { hitSlop } from "@/utils/hit-slop";

export function DrawerMenuButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className={"mt-[3px]"}
      hitSlop={hitSlop}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={27} color="#fff" className={"mr-2"} />
    </TouchableOpacity>
  );
}

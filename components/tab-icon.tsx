import { Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export function TabIcon({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
}) {
  return (
    <View className={"h-full flex flex-col mt-4 items-center"}>
      <Ionicons name={icon} size={20} color={focused ? "#0061FF" : "#FBFBFD"} />
      <Text
        className={`${focused ? "text-primary-300 font-inter-medium" : "text-accent-100 font-inter"} text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
}

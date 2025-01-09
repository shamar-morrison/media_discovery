import { Image, Text, View } from "react-native";
import React from "react";

export function TabIcon({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) {
  return (
    <View className={"flex-1 mt-3 flex flex-col items-center"}>
      <Image
        className={"size-6"}
        source={icon}
        tintColor={focused ? "#0061FF" : "#FBFBFD"}
        resizeMode={"contain"}
      />
      <Text
        className={`${focused ? "text-primary-300 font-inter-medium" : "text-accent-100 font-inter"} text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
}

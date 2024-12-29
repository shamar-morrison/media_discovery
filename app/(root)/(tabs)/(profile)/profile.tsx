import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function Profile() {
  return (
    <View className={"flex-1 mx-auto items-center justify-center"}>
      <Link className={"bg-gray-300 px-5 py-3 rounded-full"} href={"/"}>
        <Text>Profile show</Text>
      </Link>
    </View>
  );
}

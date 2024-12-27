import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export function Loading() {
  return (
    <View className="flex-1 flex items-center justify-center bg-black-200 h-full">
      <FontAwesome name={"spinner"} size={50} color={"#fff"} />
    </View>
  );
}

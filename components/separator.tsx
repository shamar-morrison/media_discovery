import { View } from "react-native";
import { ncn } from "@/utils/ncn";

export function Separator({ className }: { className?: string }) {
  return <View className={ncn("h-px w-full bg-white opacity-10", className)} />;
}

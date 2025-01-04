import { Text, TextProps } from "react-native";
import { ncn } from "@/utils/ncn";

export function ThemedText({ children, className, ...props }: TextProps) {
  return (
    <Text className={ncn(`text-white font-inter`, className)} {...props}>
      {children}
    </Text>
  );
}

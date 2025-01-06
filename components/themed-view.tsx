import { View, ViewProps } from "react-native";
import { ncn } from "@/utils/ncn";

export function ThemedView({ children, className, ...props }: ViewProps) {
  return (
    <View
      className={ncn(`flex-1 bg-black-200 h-full p-4`, className)}
      {...props}
    >
      {children}
    </View>
  );
}

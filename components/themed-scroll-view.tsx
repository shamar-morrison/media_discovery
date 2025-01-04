import { ScrollView, ScrollViewProps } from "react-native";
import { ncn } from "@/utils/ncn";

export function ThemedScrollView({
  children,
  className,
  ...props
}: ScrollViewProps) {
  return (
    <ScrollView
      className={ncn("flex-1 bg-black-200 h-full", className)}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

import { Text, TextProps } from "react-native";

export function ThemedText({ children, className, ...props }: TextProps) {
  return (
    <Text className={`text-white font-inter ${className}`} {...props}>
      {children}
    </Text>
  );
}

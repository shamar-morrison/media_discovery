import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function PersonDetailsTab({ details }: { details: string }) {
  return (
    <View>
      <ThemedText className={"leading-7"}>{details}</ThemedText>
    </View>
  );
}

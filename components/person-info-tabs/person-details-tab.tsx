import { ThemedText } from "@/components/themed-text";
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { View } from "react-native";

export function PersonDetailsTab({ details }: { details: string }) {
  if (!details) {
    return (
      <View className={"flex items-center justify-center flex-1"}>
        <ThemedText className={"text-lg font-inter-semibold"}>
          No bio available
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedScrollView
      className={"p-4"}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <ThemedText className={"leading-6"}>{details}</ThemedText>
    </ThemedScrollView>
  );
}

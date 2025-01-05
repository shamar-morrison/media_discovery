import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";

type OverviewTabProps = {
  overview: string;
};

export function OverviewTab({ overview }: OverviewTabProps) {
  if (overview === "") {
    return (
      <View className={"flex-1 flex items-center justify-center"}>
        <ThemedText className={"text-center text-lg font-inter-semibold"}>
          No overview found
        </ThemedText>
      </View>
    );
  }

  return <ThemedText className={"p-4 leading-5"}>{overview}</ThemedText>;
}

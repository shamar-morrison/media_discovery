import { ThemedText } from "@/components/themed-text";
import { ThemedScrollView } from "@/components/themed-scroll-view";

export function PersonDetailsTab({ details }: { details: string }) {
  return (
    <ThemedScrollView
      className={"p-4"}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <ThemedText className={"leading-6"}>{details}</ThemedText>
    </ThemedScrollView>
  );
}

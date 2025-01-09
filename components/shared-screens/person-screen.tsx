import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { useGetPersonInfo } from "@/hooks/use-get-person-info";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedImage } from "@/components/themed-image";
import { useAppropriateImage } from "@/utils/use-appropriate-image";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { format } from "date-fns";

export function PersonScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();

  const { data, isLoading, isError, refetch } = useGetPersonInfo(+personId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data || !data.credits || !data.details) {
    return (
      <Error
        onRetry={refetch}
        message={"There was an error. Please try again."}
      />
    );
  }

  data.details.name;

  return (
    <ThemedView>
      <View className="flex items-center gap-3">
        <ThemedImage
          style={{
            width: 120,
            height: 180,
            borderRadius: 8,
          }}
          className={"w-full h-full"}
          contentFit={"cover"}
          source={useAppropriateImage(data.details.profile_path)}
        />
        <View className={"flex gap-1"}>
          <ThemedText className={"text-2xl font-inter-semibold"}>
            {data.details.name}
          </ThemedText>
          <ThemedText className={"text-center"}>
            Born: {format(data.details.birthday, "MMM. dd, yyyy")}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

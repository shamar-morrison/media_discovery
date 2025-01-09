import { useLocalSearchParams } from "expo-router";
import { useGetPersonInfo } from "@/hooks/use-get-person-info";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedImage } from "@/components/themed-image";
import { useAppropriateImage } from "@/utils/use-appropriate-image";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { format } from "date-fns";
import { PersonTabLayout } from "@/components/person-info-tabs/person-tab-layout";
import { groupBy } from "@/utils/group-by";
import { MovieCredits, TvShowCredits } from "@/types/combined-credits";

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

  const filmography = groupBy(
    data.credits.cast,
    ({ media_type }) => media_type,
  );

  return (
    <View className={"mt-4"}>
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
        <View className={"flex gap-1 items-center"}>
          <ThemedText className={"text-2xl font-inter-semibold"}>
            {data.details.name}
          </ThemedText>
          {data.details.birthday && (
            <ThemedText className={"text-center"}>
              Born on {format(data.details.birthday, "MMM. dd, yyyy")}
            </ThemedText>
          )}
          {data.details.deathday && (
            <ThemedText className={"text-center"}>
              Died on {format(data.details.deathday, "MMM. dd, yyyy")}
            </ThemedText>
          )}
        </View>
      </View>
      <View className="mt-4 h-full">
        <PersonTabLayout
          details={data.details.biography}
          movies={filmography.movie as MovieCredits[]}
          tvShows={filmography.tv as TvShowCredits[]}
        />
      </View>
    </View>
  );
}

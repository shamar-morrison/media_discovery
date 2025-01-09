import { View } from "react-native";
import { TvShowCredits } from "@/types/combined-credits";
import { FlashList } from "@shopify/flash-list";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export function FilmographyTvShows({
  tv,
}: {
  tv: TvShowCredits[] | undefined;
}) {
  if (!tv || tv.length === 0) {
    return (
      <View className={"flex items-center justify-center flex-1"}>
        <ThemedText className={"text-lg font-inter-semibold"}>
          No TV Shows found
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlashList
        data={tv}
        renderItem={({ item, index }) => {
          return (
            <RenderItemWrapper index={index}>
              <MediaCard
                containerHeight={165}
                posterPath={item.poster_path}
                rating={item.vote_average}
                release_date={new Date(item.first_air_date)}
                title={item.name}
                id={item.id}
                mediaType={MediaType.Tv}
                containerWidth={itemWidth}
              />
            </RenderItemWrapper>
          );
        }}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={160}
      />
    </ThemedView>
  );
}

import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { useCustomListsStore } from "@/store/custom-lists-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { MediaType } from "@/types/multi-search";
import { FlashList } from "@shopify/flash-list";
import { memo, useMemo } from "react";
import { View } from "react-native";

type SectionType = {
  type: "movies" | "tvShows" | "customList";
  title: string;
  data: any[];
  id: string;
};

const WatchlistSection = memo(({ section }: { section: SectionType }) => {
  return (
    <Section title={section.title} className={"bg-black-200"}>
      {section.data.length === 0 ? (
        <ThemedText className={"mt-5"}>No items in list</ThemedText>
      ) : (
        <FlashList
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={150}
          className={"mt-4"}
          data={section.data}
          horizontal={true}
          renderItem={({ item, index }) => {
            const isLastItem = index === section.data.length - 1;

            return (
              <View className={`${!isLastItem ? "mr-3" : ""}`}>
                <SecondaryMediaCard
                  poster_path={item.poster_path}
                  vote_average={item.vote_average}
                  title={item.title}
                  id={item.id}
                  mediaType={
                    item.mediaType ||
                    (section.type === "movies" ? MediaType.Movie : MediaType.Tv)
                  }
                  release_date={item.release_date}
                />
              </View>
            );
          }}
        />
      )}
    </Section>
  );
});

export function WatchlistsTab() {
  const movies = useWatchlistStore((state) => state.movies);
  const tvShows = useWatchlistStore((state) => state.tvShows);
  const customLists = useCustomListsStore((state) => state.lists);

  const sections = useMemo(() => {
    const sectionsData: SectionType[] = [
      {
        type: "movies" as const,
        title: "Movies",
        data: movies,
        id: "movies-section",
      },
      {
        type: "tvShows" as const,
        title: "TV Shows",
        data: tvShows,
        id: "tvshows-section",
      },
      ...customLists.map((list) => ({
        type: "customList" as const,
        title: list.name,
        data: list.items,
        id: list.id,
      })),
    ];
    return sectionsData;
  }, [movies, tvShows, customLists]);

  return (
    <View className="flex-1 bg-black-200">
      <FlashList
        data={sections}
        renderItem={({ item }) => <WatchlistSection section={item} />}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

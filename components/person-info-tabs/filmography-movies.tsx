import { MovieCredits } from "@/types/combined-credits";
import { FlashList } from "@shopify/flash-list";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { ThemedView } from "@/components/themed-view";

export function FilmographyMovies({ movies }: { movies: MovieCredits[] }) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <FlashList
        data={movies}
        renderItem={({ item, index }) => {
          return (
            <RenderItemWrapper index={index}>
              <MediaCard
                containerHeight={165}
                posterPath={item.poster_path}
                rating={item.vote_average}
                release_date={
                  item.release_date ? new Date(item.release_date) : undefined
                }
                title={item.title}
                id={item.id}
                mediaType={MediaType.Movie}
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

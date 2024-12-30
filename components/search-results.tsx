import { MediaType, MultiSearchResult } from "@/types/multi-search";
import React, { useCallback } from "react";
import { Loading } from "@/components/loading";
import InitialSearchState from "@/components/initial-search-state";
import { SearchCategories } from "@/components/search-categories";
import { ThemedText } from "@/components/themed-text";
import { MediaCard } from "@/components/media-card";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { itemWidth } from "@/utils/get-item-width";
import { FlashList } from "@shopify/flash-list";
import { MovieDetailsResponse } from "@/types/movie-details";
import { NUM_COLUMNS } from "@/utils/constants";

export function SearchResults({
  results,
  query,
  isSearching,
}: {
  results: MultiSearchResult[] | null;
  query: string;
  isSearching: boolean;
}) {
  const [currentMediaType, setCurrentMediaType] = React.useState<MediaType>(
    MediaType.Movie,
  );

  const filteredResultsByMediaType = results?.filter(
    (result) => result.media_type === currentMediaType,
  );

  const updateMediaType = useCallback((mediaType: MediaType) => {
    setCurrentMediaType(mediaType);
  }, []);

  if (isSearching) {
    return <Loading />;
  }

  if (!query) {
    return <InitialSearchState />;
  }

  return (
    <>
      <SearchCategories
        handleUpdateMediaType={updateMediaType}
        currentMediaType={currentMediaType}
      />
      {filteredResultsByMediaType?.length === 0 ? (
        <ThemedText className="text-center mt-4">
          No {currentMediaType}s found for "{query}"
        </ThemedText>
      ) : (
        <FlashList
          numColumns={NUM_COLUMNS}
          data={filteredResultsByMediaType}
          renderItem={({ item, index }) => {
            if (
              filteredResultsByMediaType?.[0].media_type === MediaType.Movie
            ) {
              const castedItem = item as unknown as MovieDetailsResponse;
              return (
                <RenderItemWrapper index={index}>
                  <MediaCard
                    containerHeight={165}
                    posterPath={castedItem.poster_path}
                    rating={castedItem.vote_average}
                    release_date={castedItem.release_date}
                    title={castedItem.title}
                    id={castedItem.id}
                    mediaType={MediaType.Movie}
                    containerWidth={itemWidth}
                  />
                </RenderItemWrapper>
              );
            }
            if (filteredResultsByMediaType?.[0].media_type === MediaType.Tv) {
              return <ThemedText>TV</ThemedText>;
            }
            return <ThemedText>People</ThemedText>;
          }}
        />
      )}
    </>
  );
}

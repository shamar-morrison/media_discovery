import { MediaType, MultiSearchResult } from "@/types/multi-search";
import React, { useCallback, useState } from "react";
import { Loading } from "@/components/loading";
import { InitialSearchState } from "@/components/initial-search-state";
import { SearchCategories } from "@/components/search-categories";
import { ThemedText } from "@/components/themed-text";
import { MediaCard } from "@/components/media-card";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { itemWidth } from "@/utils/get-item-width";
import { FlashList } from "@shopify/flash-list";
import { NUM_COLUMNS } from "@/utils/constants";
import { DiscoverTvShowResult } from "@/types/discover-tv-show";
import { DiscoverMovieResult } from "@/types/discover-movie";
import { PersonDetails } from "@/types/person-details";
import { PersonCard } from "@/components/person-card";

export function SearchResults({
  results,
  query,
  isSearching,
}: {
  results: MultiSearchResult[] | null;
  query: string;
  isSearching: boolean;
}) {
  const [currentMediaType, setCurrentMediaType] = useState<MediaType>(
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
          estimatedItemSize={15}
          numColumns={NUM_COLUMNS}
          data={filteredResultsByMediaType}
          renderItem={({ item, index }) => {
            if (
              filteredResultsByMediaType?.[0].media_type === MediaType.Movie
            ) {
              const castedItem = item as unknown as DiscoverMovieResult;
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
              const castedItem = item as unknown as DiscoverTvShowResult;
              return (
                <RenderItemWrapper index={index}>
                  <MediaCard
                    containerHeight={165}
                    posterPath={castedItem.poster_path}
                    rating={castedItem.vote_average}
                    release_date={castedItem.first_air_date}
                    title={castedItem.name}
                    id={castedItem.id}
                    mediaType={MediaType.Tv}
                    containerWidth={itemWidth}
                  />
                </RenderItemWrapper>
              );
            }
            const castedItem = item as unknown as PersonDetails;
            return (
              <RenderItemWrapper index={index}>
                <PersonCard {...castedItem} credit_id={""} original_name={""} />
              </RenderItemWrapper>
            );
          }}
        />
      )}
    </>
  );
}

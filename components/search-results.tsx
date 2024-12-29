import { MediaType, MultiSearchResult } from "@/types/multi-search";
import React, { useCallback } from "react";
import { Loading } from "@/components/loading";
import InitialSearchState from "@/components/initial-search-state";
import { SearchCategories } from "@/components/search-categories";
import { ThemedText } from "@/components/themed-text";
import { ScrollView } from "react-native";
import { MediaCard } from "@/components/media-card";

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
        <ScrollView className={"flex gap-2"}>
          {filteredResultsByMediaType?.map((result) => (
            <ThemedText key={result.id}>
              {result.media_type === MediaType.Movie ? (
                <MediaCard
                  posterPath={result.poster_path ?? ""}
                  rating={result.vote_average ?? 0}
                  release_date={result.release_date ?? new Date()}
                  title={result.title ?? "unknown"}
                  id={result.id}
                  mediaType={MediaType.Movie}
                />
              ) : (
                result.name
              )}
            </ThemedText>
          ))}
        </ScrollView>
      )}
    </>
  );
}

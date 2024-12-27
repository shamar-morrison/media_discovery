import { ScrollView, TextInput, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { ThemedView } from "@/components/themed-view";
import { debounce } from "@/utils/debounce";
import { axiosInstance } from "@/lib/api-client";
import {
  MediaType,
  MultiSearchResponse,
  MultiSearchResult,
} from "@/types/multi-search";
import { ThemedText } from "@/components/themed-text";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import InitialSearchState from "@/components/initial-search-state";
import NoSearchResults from "@/components/no-search-results";
import { SearchCategories } from "@/components/search-categories";

export default function Explore() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<MultiSearchResult[] | null>(
    null,
  );

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length === 0) {
        setResults(null);
        return;
      }

      setIsSearching(true);
      try {
        const res = await axiosInstance.get<MultiSearchResponse>(
          `/search/multi?query=${query}`,
        );
        setResults(res.data.results);
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      } finally {
        setIsSearching(false);
      }
    }, 350),
    [],
  );

  const retrySearch = useCallback(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleChangeText = (text: string) => {
    setError(null);
    setSearchQuery(text);
    handleSearch(text);
  };

  return (
    <ThemedView>
      <TextInput
        value={searchQuery}
        onChangeText={handleChangeText}
        placeholder={"Search..."}
        className={
          "bg-black-100 px-3 text-white rounded-lg placeholder:text-accent-100"
        }
      />
      {error ? (
        <Error onRetry={retrySearch} />
      ) : (
        <SearchResults
          results={results}
          query={searchQuery}
          isSearching={isSearching}
        />
      )}
    </ThemedView>
  );
}

function SearchResults({
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

  const filteredResults = results?.filter(
    (result) => result.media_type === currentMediaType,
  );

  const updateMediaType = useCallback((mediaType: MediaType) => {
    setCurrentMediaType(mediaType);
  }, []);

  if (isSearching) {
    return <Loading />;
  }

  if (filteredResults?.length === 0 && query) {
    return <NoSearchResults />;
  }

  if (filteredResults === null || filteredResults?.length === 0) {
    return <InitialSearchState />;
  }

  return (
    <>
      <SearchCategories
        handleUpdateMediaType={updateMediaType}
        currentMediaType={currentMediaType}
      />
      <ScrollView className={"flex gap-2"}>
        {filteredResults?.map((result) => (
          <ThemedText key={result.id}>{result.name}</ThemedText>
        ))}
      </ScrollView>
    </>
  );
}

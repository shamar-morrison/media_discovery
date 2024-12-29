import { TextInput } from "react-native";
import React, { useCallback } from "react";
import { ThemedView } from "@/components/themed-view";
import { debounce } from "@/utils/debounce";
import { axiosInstance } from "@/lib/api-client";
import { MultiSearchResponse, MultiSearchResult } from "@/types/multi-search";
import { Error } from "@/components/error";
import { SearchResults } from "@/components/search-results";

export default function Search() {
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

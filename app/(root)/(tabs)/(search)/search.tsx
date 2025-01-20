import { TextInput, View } from "react-native";
import React, { useCallback } from "react";
import { debounce } from "@/utils/debounce";
import { axiosInstance } from "@/lib/api-client";
import {
  MediaType,
  MultiSearchResponse,
  MultiSearchResult,
} from "@/types/multi-search";
import { Error } from "@/components/error";
import { SearchResults } from "@/components/search-results";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { tabStyles } from "@/styles/tab-styles";
import { TabBarLabel } from "@/components/tab-bar-label";

const Tab = createMaterialTopTabNavigator();

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
    <View className={"flex-1"}>
      <View className={"px-4 pt-4 pb-0"}>
        <TextInput
          value={searchQuery}
          onChangeText={handleChangeText}
          placeholder={"Search..."}
          className="bg-black-100 px-3 text-white rounded-lg placeholder:text-accent-100 mb-4"
        />
      </View>
      {error ? (
        <Error onRetry={retrySearch} />
      ) : (
        <Tab.Navigator screenOptions={tabStyles} backBehavior="none">
          <Tab.Screen
            name="movies"
            component={undefined}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused}>Movies</TabBarLabel>
              ),
            }}
          >
            {() => (
              <SearchResults
                results={results}
                query={searchQuery}
                isSearching={isSearching}
                mediaType={MediaType.Movie}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="tv"
            component={undefined}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused}>TV Shows</TabBarLabel>
              ),
            }}
          >
            {() => (
              <SearchResults
                results={results}
                query={searchQuery}
                isSearching={isSearching}
                mediaType={MediaType.Tv}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="people"
            component={undefined}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused}>People</TabBarLabel>
              ),
            }}
          >
            {() => (
              <SearchResults
                results={results}
                query={searchQuery}
                isSearching={isSearching}
                mediaType={MediaType.Person}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import { MediaType, MultiSearchResult } from "@/types/multi-search";

const categories = [
  {
    type: MediaType.Movie,
    name: "Movies",
  },
  {
    type: MediaType.Tv,
    name: "TV Shows",
  },
  {
    type: MediaType.Person,
    name: "People",
  },
];

export function SearchCategories({
  handleUpdateMediaType,
  currentMediaType,
}: {
  handleUpdateMediaType: (mediaType: MediaType) => void;
  currentMediaType: MediaType;
}) {
  return (
    <View className={"flex flex-row gap-2 my-4"}>
      {categories.map((category) => (
        <TouchableOpacity
          onPress={() => handleUpdateMediaType(category.type)}
          key={category.type}
          className={`border-[0.4px] border-accent-100 rounded-lg px-4 py-1 ${
            category.type === currentMediaType
              ? "bg-primary-300 text-white border-transparent"
              : "bg-black-100 text-accent-100"
          }`}
        >
          <ThemedText>{category.name}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

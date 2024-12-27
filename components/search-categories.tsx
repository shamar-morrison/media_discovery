import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import { MediaType, MultiSearchResult } from "@/types/multi-search";

const categories = [
  {
    id: 1,
    type: MediaType.Movie,
    name: "Movies",
  },
  {
    id: 2,
    type: MediaType.Tv,
    name: "TV Shows",
  },
  {
    id: 3,
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
          key={category.id}
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

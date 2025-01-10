import { TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import { MediaType } from "@/types/multi-search";
import { ncn } from "@/utils/ncn";

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
    <View className="my-4 flex-row">
      {categories.map((category, i, array) => (
        <TouchableOpacity
          onPress={() => handleUpdateMediaType(category.type)}
          key={category.type}
          className={ncn(
            `flex-1 border-[0.5px] mx-1 border-accent-100/20 rounded-lg px-4 py-2`,
            category.type === currentMediaType
              ? "bg-primary-300 text-white border-transparent"
              : "bg-black-100 text-accent-100",
            i === array.length - 1 && "mx-0",
            i === 0 && "mx-0",
          )}
        >
          <ThemedText className="text-center">{category.name}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

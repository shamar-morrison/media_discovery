import { GenreFilter } from "@/components/genre-filter";
import { RatingFilter } from "@/components/rating-filter";
import { YearFilter } from "@/components/year-filter";
import { MediaType } from "@/types/multi-search";
import React, { memo } from "react";
import { View } from "react-native";

interface FilterBarProps {
  genreId: number | undefined;
  year: number | undefined;
  rating: number | undefined;
  onGenreChange: (id: number | undefined) => void;
  onYearChange: (year: number | undefined) => void;
  onRatingChange: (rating: number | undefined) => void;
  mediaType: MediaType.Movie | MediaType.Tv;
}

export const FilterBar = memo(function FilterBar({
  genreId,
  year,
  rating,
  onGenreChange,
  onYearChange,
  onRatingChange,
  mediaType,
}: FilterBarProps) {
  return (
    <View className="flex-row gap-4 justify-between px-4">
      <GenreFilter
        onChange={onGenreChange}
        initialGenreId={genreId}
        type={mediaType}
      />
      <YearFilter onChange={onYearChange} initialYear={year} />
      <RatingFilter onChange={onRatingChange} initialRating={rating} />
    </View>
  );
});

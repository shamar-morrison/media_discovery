import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { MOVIE_GENRES, TV_GENRES } from "@/types/genres";
import { MediaType } from "@/types/multi-search";
import { PRIMARY_BLUE } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

interface FilterProps {
  onChange: (genreId: number | undefined) => void;
  initialGenreId?: number;
  type: MediaType.Movie | MediaType.Tv;
}

const GenreItem = React.memo(
  ({
    item,
    isSelected,
    onPress,
  }: {
    item: { id: number | undefined; name: string };
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className={"flex-1 py-4 flex-row items-center"}
    >
      <ThemedText>{item.name}</ThemedText>
      {isSelected && (
        <Ionicons
          name={"checkmark-circle"}
          size={22}
          color={PRIMARY_BLUE}
          className={"ml-3"}
        />
      )}
    </Pressable>
  ),
);

export function GenreFilter({ onChange, initialGenreId, type }: FilterProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(
    initialGenreId,
  );
  const [selectedGenreName, setSelectedGenreName] = useState<
    string | undefined
  >(
    type === MediaType.Movie
      ? Object.values(MOVIE_GENRES).find((genre) => genre.id === initialGenreId)
          ?.name
      : Object.values(TV_GENRES).find((genre) => genre.id === initialGenreId)
          ?.name,
  );
  const [isClosing, setIsClosing] = useState(false);

  const bottomSheetModalRef = useSheetRef();

  const handlePresentModalPress = useCallback(() => {
    if (isClosing) return;
    bottomSheetModalRef.current?.present();
  }, [isClosing]);

  const handleCloseSheetPress = useCallback(() => {
    setIsClosing(true);
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsClosing(false);
    }
  }, []);

  const handleGenreUpdate = useCallback(
    (genreId: number | undefined, genreName: string | undefined) => {
      setSelectedGenreName(genreName);
      setSelectedGenreId(genreId);
      onChange(genreId);
      handleCloseSheetPress();
    },
    [onChange, handleCloseSheetPress],
  );

  const genres = useMemo(() => {
    const genreList = type === MediaType.Movie ? MOVIE_GENRES : TV_GENRES;
    return [{ id: undefined, name: "All" }, ...Object.values(genreList)];
  }, [type]);

  const renderItem = useCallback(
    ({ item }: { item: { id: number | undefined; name: string } }) => {
      const isSelected =
        item.id === selectedGenreId ||
        (item.id === undefined && !selectedGenreId);
      return (
        <GenreItem
          item={item}
          isSelected={isSelected}
          onPress={() => handleGenreUpdate(item.id, item.name)}
        />
      );
    },
    [handleGenreUpdate, selectedGenreId],
  );

  return (
    <Pressable
      onPress={handlePresentModalPress}
      className={"flex-1 py-3 px-4 rounded-lg bg-black-100"}
    >
      <View className={"flex-row items-center justify-between"}>
        <ThemedText numberOfLines={1} style={{ width: 65 }}>
          {selectedGenreName || "Genre"}
        </ThemedText>
        <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
      </View>
      <Sheet
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["80%"]}
        enableDynamicSizing={false}
      >
        <View className={"px-6 py-4"}>
          <ThemedText className={"text-2xl font-inter-semibold"}>
            Genres
          </ThemedText>
        </View>
        <BottomSheetVirtualizedList
          data={genres}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        />
      </Sheet>
    </Pressable>
  );
}

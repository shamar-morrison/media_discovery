import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useCallback, useMemo, useState } from "react";
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { MOVIE_GENRES } from "@/types/genres";
import { PRIMARY_BLUE } from "@/utils/constants";

interface FilterProps {
  onChange: (genreId: number | undefined) => void;
  initialGenreId?: number;
}

export function GenreFilter({
  onChange,
  initialGenreId = MOVIE_GENRES.ACTION.id,
}: FilterProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(
    initialGenreId,
  );
  const [selectedGenreName, setSelectedGenreName] = useState<
    string | undefined
  >(
    Object.values(MOVIE_GENRES).find((genre) => genre.id === initialGenreId)
      ?.name,
  );

  const bottomSheetModalRef = useSheetRef();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseSheetPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const snapPoints = useMemo(() => ["50%"], []);

  const handleSheetChanges = useHandleSheetChanges();

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
    return [{ id: undefined, name: "All" }, ...Object.values(MOVIE_GENRES)];
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { id: number | undefined; name: string } }) => {
      const isSelected =
        item.id === selectedGenreId ||
        (item.id === undefined && !selectedGenreId);

      return (
        <Pressable
          onPress={() => handleGenreUpdate(item.id, item.name)}
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
      );
    },
    [handleGenreUpdate, selectedGenreId],
  );

  return (
    <Pressable
      onPress={handlePresentModalPress}
      className={"flex-1 py-3 px-4 rounded-lg bg-black-100"}
      hitSlop={hitSlop}
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
        enableDynamicSizing={false}
        snapPoints={snapPoints}
      >
        <View className={"px-6 py-4"}>
          <ThemedText
            className={"text-2xl font-inter-semibold sticky top-0 left-0"}
          >
            Genres
          </ThemedText>
        </View>
        <BottomSheetVirtualizedList
          data={genres}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      </Sheet>
    </Pressable>
  );
}

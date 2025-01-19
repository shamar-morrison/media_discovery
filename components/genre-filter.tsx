import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useCallback, useMemo, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { MOVIE_GENRES } from "@/types/genres";

interface FilterProps {
  onChange: (genreId: number | undefined) => void;
}

export function GenreFilter({ onChange }: FilterProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(
    MOVIE_GENRES.ACTION.id,
  );
  const [selectedGenreName, setSelectedGenreName] = useState<
    string | undefined
  >(MOVIE_GENRES.ACTION.name);

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

  return (
    <View
      className={"flex-1 py-3 px-4 rounded-lg bg-black-100"}
      hitSlop={hitSlop}
    >
      <Pressable
        onPress={handlePresentModalPress}
        hitSlop={hitSlop}
        className={"flex-row items-center justify-between"}
      >
        <ThemedText numberOfLines={1}>
          {selectedGenreName || "Genre"}
        </ThemedText>
        <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
      </Pressable>
      <Sheet
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
      >
        <BottomSheetScrollView className={"flex-1 px-6 py-4 max-h-[50vh] mb-8"}>
          <ThemedText
            className={"text-2xl font-inter-semibold mb-4 sticky top-0 left-0"}
          >
            Genres
          </ThemedText>
          {Object.entries(MOVIE_GENRES).map(([_, obj]) => {
            return (
              <Pressable
                onPress={() => handleGenreUpdate(obj.id, obj.name)}
                className={"flex-1 py-4 flex-row items-center"}
                key={obj.name}
              >
                <ThemedText>{obj.name}</ThemedText>
                {selectedGenreId === obj.id && (
                  <Ionicons
                    name={"checkmark-circle"}
                    size={22}
                    color={"#0061FF"}
                    className={"ml-3"}
                  />
                )}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </Sheet>
    </View>
  );
}

import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useCallback, useMemo, useState } from "react";
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { PRIMARY_BLUE } from "@/utils/constants";

interface RatingFilterProps {
  onChange: (rating: number | undefined) => void;
  initialRating?: number;
}

export function RatingFilter({ onChange, initialRating }: RatingFilterProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    initialRating,
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

  const handleRatingUpdate = useCallback(
    (rating: number | undefined) => {
      setSelectedRating(rating);
      onChange(rating);
      handleCloseSheetPress();
    },
    [onChange, handleCloseSheetPress],
  );

  const ratings = useMemo(
    () => ["all", ...Array.from({ length: 9 }, (_, i) => 9 - i)],
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: string | number }) => {
      const isAll = item === "all";
      const isSelected = isAll ? !selectedRating : selectedRating === item;

      return (
        <Pressable
          onPress={() =>
            handleRatingUpdate(isAll ? undefined : (item as number))
          }
          className={"flex-1 py-4 flex-row items-center"}
        >
          <ThemedText>{isAll ? "All Ratings" : `${item}+`}</ThemedText>
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
    [handleRatingUpdate, selectedRating],
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
        <ThemedText numberOfLines={1} style={{ width: 65 }}>
          {selectedRating ? `${selectedRating}+` : "Rating"}
        </ThemedText>
        <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
      </Pressable>
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
            Minimum Rating
          </ThemedText>
        </View>
        <BottomSheetVirtualizedList
          data={ratings}
          keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      </Sheet>
    </View>
  );
}

import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { PRIMARY_BLUE } from "@/utils/constants";
import { hitSlop } from "@/utils/hit-slop";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

interface RatingFilterProps {
  onChange: (rating: number | undefined) => void;
  initialRating?: number;
}

const RatingItem = React.memo(
  ({
    item,
    isSelected,
    onPress,
  }: {
    item: string | number;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className={"flex-1 py-4 flex-row items-center"}
    >
      <ThemedText>
        {typeof item === "string" ? "All Ratings" : `${item}+`}
      </ThemedText>
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

export function RatingFilter({ onChange, initialRating }: RatingFilterProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    initialRating,
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
        <RatingItem
          item={item}
          isSelected={isSelected}
          onPress={() =>
            handleRatingUpdate(isAll ? undefined : (item as number))
          }
        />
      );
    },
    [handleRatingUpdate, selectedRating],
  );

  return (
    <Pressable
      onPress={handlePresentModalPress}
      className={"flex-1 py-3 px-4 rounded-lg bg-black-100"}
      hitSlop={hitSlop}
    >
      <View className={"flex-row items-center justify-between"}>
        <ThemedText numberOfLines={1} style={{ width: 65 }}>
          {selectedRating ? `${selectedRating}+` : "Rating"}
        </ThemedText>
        <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
      </View>
      <Sheet
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={true}
      >
        <View className={"px-6 py-4"}>
          <ThemedText className={"text-2xl font-inter-semibold"}>
            Minimum Rating
          </ThemedText>
        </View>
        <BottomSheetVirtualizedList
          data={ratings}
          keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        />
      </Sheet>
    </Pressable>
  );
}

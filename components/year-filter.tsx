import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useCallback, useMemo, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { PRIMARY_BLUE } from "@/utils/constants";

interface YearFilterProps {
  onChange: (year: number | undefined) => void;
  initialYear?: number;
}

export function YearFilter({ onChange, initialYear }: YearFilterProps) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    initialYear,
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

  const handleYearUpdate = useCallback(
    (year: number | undefined) => {
      setSelectedYear(year);
      onChange(year);
      handleCloseSheetPress();
    },
    [onChange, handleCloseSheetPress],
  );

  // Generate years from current year to 1900
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i,
    );
  }, []);

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
          {selectedYear || "Year"}
        </ThemedText>
        <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
      </Pressable>
      <Sheet
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
      >
        <BottomSheetScrollView
          className={"flex-1 px-6 py-4 max-h-[50vh] mb-8"}
          persistentScrollbar={true}
          showsVerticalScrollIndicator={true}
        >
          <ThemedText
            className={"text-2xl font-inter-semibold mb-4 sticky top-0 left-0"}
          >
            Year
          </ThemedText>
          <Pressable
            onPress={() => handleYearUpdate(undefined)}
            className={"flex-1 py-4 flex-row items-center"}
            key={"all"}
          >
            <ThemedText>All Years</ThemedText>
            {!selectedYear && (
              <Ionicons
                name={"checkmark-circle"}
                size={22}
                color={PRIMARY_BLUE}
                className={"ml-3"}
              />
            )}
          </Pressable>
          {years.map((year) => (
            <Pressable
              key={year}
              onPress={() => handleYearUpdate(year)}
              className={"flex-1 py-4 flex-row items-center"}
            >
              <ThemedText>{year}</ThemedText>
              {selectedYear === year && (
                <Ionicons
                  name={"checkmark-circle"}
                  size={22}
                  color={PRIMARY_BLUE}
                  className={"ml-3"}
                />
              )}
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </Sheet>
    </View>
  );
}

import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useCallback, useMemo, useState } from "react";
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { PRIMARY_BLUE } from "@/utils/constants";

interface YearFilterProps {
  onChange: (year: number | undefined) => void;
  initialYear?: number;
}

export function YearFilter({ onChange, initialYear }: YearFilterProps) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    initialYear,
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

  const snapPoints = useMemo(() => ["50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsClosing(false);
    }
  }, []);

  const handleYearUpdate = useCallback(
    (year: number | undefined) => {
      setSelectedYear(year);
      onChange(year);
      handleCloseSheetPress();
    },
    [onChange, handleCloseSheetPress],
  );

  // Generate years from current year to 1950
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      "all",
      ...Array.from(
        { length: currentYear - 1950 + 1 },
        (_, i) => currentYear - i,
      ),
    ];
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: string | number }) => {
      const isAll = item === "all";
      const isSelected = isAll ? !selectedYear : selectedYear === item;

      return (
        <Pressable
          onPress={() => handleYearUpdate(isAll ? undefined : (item as number))}
          className={"flex-1 py-4 flex-row items-center"}
        >
          <ThemedText>{isAll ? "All Years" : item}</ThemedText>
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
    [handleYearUpdate, selectedYear],
  );

  return (
    <Pressable
      onPress={handlePresentModalPress}
      className={"flex-1 py-3 px-4 rounded-lg bg-black-100"}
      hitSlop={hitSlop}
    >
      <View className={"flex-row items-center justify-between"}>
        <ThemedText numberOfLines={1} style={{ width: 65 }}>
          {selectedYear || "Year"}
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
            Year
          </ThemedText>
        </View>
        <BottomSheetVirtualizedList
          data={years}
          keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      </Sheet>
    </Pressable>
  );
}

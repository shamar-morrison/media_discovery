import { Sheet } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { hitSlop } from "@/utils/hit-slop";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

type SheetItem = {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
  section: "movies" | "tv";
};

export function DrawerMenuButton() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseSheetPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useHandleSheetChanges();

  const allItems: SheetItem[] = useMemo(() => {
    const movies = [
      {
        name: "Popular",
        icon: "sparkles",
        route: "/popular-movies",
        section: "movies",
      },
      {
        name: "Top Rated",
        icon: "arrow-up-circle",
        route: "/top-rated-movies",
        section: "movies",
      },
      {
        name: "Genres",
        icon: "list",
        route: "/movie-genres",
        section: "movies",
      },
      {
        name: "Now Playing",
        icon: "play",
        route: "/now-playing",
        section: "movies",
      },
    ] as const;

    const tvShows = [
      {
        name: "Genres",
        icon: "list",
        route: "/tv-genres",
        section: "tv",
      },
    ] as const;

    return [...movies, ...tvShows];
  }, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: "movies" | "tv" }) => (
      <ThemedText className={"text-2xl font-inter-semibold mb-4"}>
        {section === "movies" ? "Movies" : "TV Shows"}
      </ThemedText>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: SheetItem }) => (
      <MemoizedSheetItem
        key={item.route}
        closeSheet={handleCloseSheetPress}
        name={item.name}
        icon={item.icon}
        route={item.route}
        style={item.section === "tv" ? { width: "100%" } : { width: "47%" }}
      />
    ),
    [handleCloseSheetPress],
  );

  return (
    <View>
      <TouchableOpacity
        className={"mt-[3px]"}
        hitSlop={hitSlop}
        onPress={handlePresentModalPress}
      >
        <Ionicons name="menu" size={27} color="#fff" className={"mr-2"} />
      </TouchableOpacity>
      <Sheet
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enableDynamicSizing
      >
        <BottomSheetView className={"flex-1 px-6 py-4"}>
          <BottomSheetFlatList
            data={allItems.filter((item) => item.section === "movies")}
            renderItem={renderItem}
            keyExtractor={(item) => item.route}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            ListHeaderComponent={renderSectionHeader({ section: "movies" })}
            ListFooterComponent={
              <>
                {renderSectionHeader({ section: "tv" })}
                {allItems
                  .filter((item) => item.section === "tv")
                  .map((item) => renderItem({ item }))}
              </>
            }
            numColumns={2}
            columnWrapperStyle={{
              gap: 16,
              marginBottom: 16,
            }}
          />
        </BottomSheetView>
      </Sheet>
    </View>
  );
}

function SheetItem({
  name,
  icon,
  route,
  closeSheet,
  style,
}: {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
  closeSheet: () => void;
  style?: React.ComponentProps<typeof Pressable>["style"];
}) {
  const handleNavigation = useCallback(() => {
    router.push(route as any);
    closeSheet();
  }, [route, closeSheet]);

  return (
    <Pressable
      hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      className="bg-primary-200/50 rounded-lg p-3"
      onPress={handleNavigation}
      style={style}
    >
      <View className={"flex flex-row gap-2 pl-2 items-center"}>
        <Ionicons name={icon} size={24} color={"#fff"} />
        <ThemedText>{name}</ThemedText>
      </View>
    </Pressable>
  );
}

const MemoizedSheetItem = React.memo(SheetItem);

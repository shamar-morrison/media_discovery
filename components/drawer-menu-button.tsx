import { Pressable, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/nativewindui/Sheet";
import { router } from "expo-router";

type SheetItem = {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
};

export function DrawerMenuButton() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseSheetPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const moviesSheetItems: SheetItem[] = useMemo(() => {
    return [
      {
        name: "Popular",
        icon: "sparkles",
        route: "/popular-movies",
      },
      {
        name: "Top Rated",
        icon: "arrow-up-circle",
        route: "/top-rated-movies",
      },
      {
        name: "Genres",
        icon: "list",
        route: "/movie-genres",
      },
      {
        name: "Now Playing",
        icon: "play",
        route: "/now-playing",
      },
    ];
  }, []);

  const tvShowsSheetItems: SheetItem[] = useMemo(() => {
    return [
      {
        name: "Airing Today",
        icon: "tv",
        route: "/airing-today",
      },
      {
        name: "Popular",
        icon: "star",
        route: "/popular-tv-shows",
      },
      {
        name: "Genres",
        icon: "list",
        route: "/tv-genres",
      },
      {
        name: "On The Air",
        icon: "videocam",
        route: "/on-the-air",
      },
    ];
  }, []);

  return (
    <View>
      <TouchableOpacity
        className={"mt-[3px]"}
        hitSlop={hitSlop}
        onPress={handlePresentModalPress}
      >
        <Ionicons name="menu" size={27} color="#fff" className={"mr-2"} />
      </TouchableOpacity>
      <Sheet ref={bottomSheetModalRef} onChange={handleSheetChanges}>
        <BottomSheetView className={"flex-1 px-6 py-4 min-h-[50vh]"}>
          <ThemedText className={"text-2xl font-inter-semibold mb-4"}>
            Movies
          </ThemedText>
          <View className={"flex flex-row flex-wrap gap-4"}>
            {moviesSheetItems.map((item, i) => (
              <SheetItem
                key={i}
                closeSheet={handleCloseSheetPress}
                name={item.name}
                icon={item.icon}
                route={item.route}
              />
            ))}
          </View>
          <ThemedText className={"text-2xl font-inter-semibold mb-4 mt-8"}>
            TV Shows
          </ThemedText>
          <View className={"flex flex-row flex-wrap gap-4"}>
            {tvShowsSheetItems.map((item, i) => (
              <SheetItem
                key={i}
                closeSheet={handleCloseSheetPress}
                name={item.name}
                icon={item.icon}
                route={item.route}
              />
            ))}
          </View>
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
}: {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
  closeSheet: () => void;
}) {
  const handleNavigation = () => {
    router.push(route as any);
    closeSheet();
  };

  return (
    <Pressable
      hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      className="bg-primary-200/50 rounded-lg p-3 w-[47%]"
      onPress={handleNavigation}
    >
      <View className={"flex flex-row gap-2 pl-2 items-center"}>
        <Ionicons name={icon} size={24} color={"#fff"} />
        <ThemedText>{name}</ThemedText>
      </View>
    </Pressable>
  );
}

import { TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/nativewindui/Sheet";

export function DrawerMenuButton() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
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
            <SheetItem name={"Popular"} icon={"sparkles"} />
            <SheetItem name={"Top Rated"} icon={"arrow-up-circle"} />
            <SheetItem name={"Genres"} icon={"list"} />
            <SheetItem name={"Now Playing"} icon={"play"} />
          </View>
          <ThemedText className={"text-2xl font-inter-semibold mb-4 mt-8"}>
            TV Shows
          </ThemedText>
          <View className={"flex flex-row flex-wrap gap-4"}>
            <SheetItem name={"Airing Today"} icon={"tv"} />
            <SheetItem name={"Popular"} icon={"star"} />
            <SheetItem name={"Genres"} icon={"list"} />
            <SheetItem name={"On The Air"} icon={"videocam"} />
          </View>
        </BottomSheetView>
      </Sheet>
    </View>
  );
}

function SheetItem({
  name,
  icon,
}: {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <View className="flex flex-row gap-2 pl-5 items-center bg-primary-200/50 rounded-lg p-3 w-[47%]">
      <Ionicons name={icon} size={24} color={"#fff"} />
      <ThemedText>{name}</ThemedText>
    </View>
  );
}

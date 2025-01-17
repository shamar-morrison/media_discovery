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
        <BottomSheetView className={"flex-1 items-center min-h-[50vh]"}>
          <ThemedText>Awesome 🎉</ThemedText>
        </BottomSheetView>
      </Sheet>
    </View>
  );
}

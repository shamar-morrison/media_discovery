import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { useSettingsStore } from "@/store/settings-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { MediaType } from "@/types/multi-search";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  showId: number;
  showName: string;
  onRemoveComplete?: () => void;
  sheetRef: ReturnType<typeof useSheetRef>;
}

const SheetButton = React.memo(
  ({
    onPress,
    className,
    children,
  }: {
    onPress: () => void;
    className: string;
    children: React.ReactNode;
  }) => (
    <TouchableOpacity onPress={onPress} className={className}>
      <ThemedText className="text-center font-inter-medium">
        {children}
      </ThemedText>
    </TouchableOpacity>
  ),
);

export function RemoveTvShowSheet({
  showId,
  showName,
  onRemoveComplete,
  sheetRef,
}: Props) {
  const [rememberChoice, setRememberChoice] = useState(false);
  const handleSheetChanges = useHandleSheetChanges();
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist,
  );
  const initialize = useWatchedEpisodesStore((state) => state.initialize);
  const setTvShowRemovalPreference = useSettingsStore(
    (state) => state.setTvShowRemovalPreference,
  );

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, [sheetRef]);

  const handleRemoveWithProgress = useCallback(async () => {
    try {
      await removeFromWatchlist(showId, MediaType.Tv, true);
      await initialize();
      if (rememberChoice) {
        await setTvShowRemovalPreference("with_progress");
      }
      handleClose();
      onRemoveComplete?.();
    } catch (error) {
      console.error("Error removing show and progress:", error);
      showToast("Error removing show and progress");
    }
  }, [
    showId,
    removeFromWatchlist,
    initialize,
    handleClose,
    onRemoveComplete,
    rememberChoice,
    setTvShowRemovalPreference,
  ]);

  const handleRemoveWatchlistOnly = useCallback(async () => {
    try {
      await removeFromWatchlist(showId, MediaType.Tv, false);
      if (rememberChoice) {
        await setTvShowRemovalPreference("without_progress");
      }
      handleClose();
      onRemoveComplete?.();
    } catch (error) {
      console.error("Error removing show from watchlist:", error);
      showToast("Error removing show from watchlist");
    }
  }, [
    showId,
    removeFromWatchlist,
    handleClose,
    onRemoveComplete,
    rememberChoice,
    setTvShowRemovalPreference,
  ]);

  const toggleRememberChoice = useCallback(() => {
    setRememberChoice((prev) => !prev);
  }, []);

  return (
    <Sheet ref={sheetRef} onChange={handleSheetChanges} enableDynamicSizing>
      <BottomSheetView className="p-4">
        <View className="items-center mb-6">
          <ThemedText className="text-lg font-inter-semibold text-center mb-2">
            Remove {showName}
          </ThemedText>
          <ThemedText className="text-sm text-center opacity-70">
            Do you want to remove this show from your watchlist and delete all
            progress? This action cannot be undone.
          </ThemedText>
        </View>

        <View className="gap-4">
          <SheetButton
            onPress={handleRemoveWithProgress}
            className="bg-red-500 p-4 rounded-lg"
          >
            Remove and Delete Progress
          </SheetButton>

          <SheetButton
            onPress={handleRemoveWatchlistOnly}
            className="bg-gray-700 p-4 rounded-lg"
          >
            Remove only from Watchlist
          </SheetButton>

          <TouchableOpacity
            onPress={toggleRememberChoice}
            className="flex-row items-center justify-center mt-2"
          >
            <View className="w-5 h-5 border border-gray-500 rounded mr-2 items-center justify-center">
              {rememberChoice && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <ThemedText className="opacity-70">Remember my choice</ThemedText>
          </TouchableOpacity>

          <SheetButton onPress={handleClose} className="p-4">
            Cancel
          </SheetButton>
        </View>
      </BottomSheetView>
    </Sheet>
  );
}

export function useRemoveTvShowSheet() {
  const sheetRef = useSheetRef();

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return {
    sheetRef,
    openSheet,
  };
}

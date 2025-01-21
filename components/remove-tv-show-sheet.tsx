import React, { forwardRef, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";
import { MediaType } from "@/types/multi-search";
import { useSettingsStore } from "@/store/settings-store";
import Ionicons from "@expo/vector-icons/Ionicons";

interface RemoveTvShowSheetProps {
  showId: number;
  showName: string;
  onRemoveComplete?: () => void;
}

export const RemoveTvShowSheet = forwardRef<
  BottomSheetModal,
  RemoveTvShowSheetProps
>(({ showId, showName, onRemoveComplete }, ref) => {
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
    if (ref && "current" in ref) {
      ref.current?.close();
    }
  }, [ref]);

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

  return (
    <Sheet
      ref={ref}
      snapPoints={["45%"]}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <BottomSheetView className="p-4 flex-1">
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
          <TouchableOpacity
            onPress={handleRemoveWithProgress}
            className="bg-red-500 p-4 rounded-lg"
          >
            <ThemedText className="text-center font-inter-medium">
              Remove and Delete Progress
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRemoveWatchlistOnly}
            className="bg-gray-700 p-4 rounded-lg"
          >
            <ThemedText className="text-center font-inter-medium">
              Remove only from Watchlist
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRememberChoice(!rememberChoice)}
            className="flex-row items-center justify-center mt-2"
          >
            <View className="w-5 h-5 border border-gray-500 rounded mr-2 items-center justify-center">
              {rememberChoice && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <ThemedText className="opacity-70">Remember my choice</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} className="p-4">
            <ThemedText className="text-center opacity-70">Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </Sheet>
  );
});

export function useRemoveTvShowSheet() {
  const sheetRef = React.useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return {
    sheetRef,
    openSheet,
  };
}

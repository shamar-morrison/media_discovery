import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { MediaType } from "@/types/multi-search";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  showId: number;
  showName: string;
  onComplete?: () => void;
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

export function TvShowOptionsSheet({
  showId,
  showName,
  onComplete,
  sheetRef,
}: Props) {
  const handleSheetChanges = useHandleSheetChanges();
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist,
  );
  const initialize = useWatchedEpisodesStore((state) => state.initialize);

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, [sheetRef]);

  const handleDeleteProgress = useCallback(async () => {
    try {
      await removeFromWatchlist(showId, MediaType.Tv, true);
      await initialize();
      handleClose();
      onComplete?.();
    } catch (error) {
      console.error("Error removing show and progress:", error);
    }
  }, [showId, removeFromWatchlist, initialize, handleClose, onComplete]);

  const handleViewDetails = useCallback(() => {
    router.push({
      pathname: "/[mediaId]",
      params: { mediaId: showId, mediaType: MediaType.Tv },
    });
    handleClose();
  }, [showId, handleClose]);

  return (
    <Sheet ref={sheetRef} onChange={handleSheetChanges} enableDynamicSizing>
      <BottomSheetView className="p-4">
        <View className="items-center mb-6">
          <ThemedText className="text-lg font-inter-semibold text-center mb-2">
            {showName}
          </ThemedText>
        </View>

        <View className="gap-4">
          <SheetButton
            onPress={handleDeleteProgress}
            className="bg-red-500 p-4 rounded-lg"
          >
            Delete Progress
          </SheetButton>

          <SheetButton
            onPress={handleViewDetails}
            className="bg-gray-700 p-4 rounded-lg"
          >
            View Details
          </SheetButton>

          <SheetButton onPress={handleClose} className="p-4">
            Cancel
          </SheetButton>
        </View>
      </BottomSheetView>
    </Sheet>
  );
}

export function useTvShowOptionsSheet() {
  const sheetRef = useSheetRef();

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return {
    sheetRef,
    openSheet,
  };
}

import { Sheet, useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { useCustomListsStore } from "@/store/custom-lists-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { WATCHED_EPISODES_STORAGE_KEY } from "@/utils/constants";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { hitSlop } from "@/utils/hit-slop";
import { isValidWatchlistCSV } from "@/utils/is-valid-watchlist-csv";
import { showToast } from "@/utils/toast";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

interface WatchedEpisodesData {
  [key: string]: {
    showId: number;
    showName: string;
    seasons: Array<{
      seasonNumber: number;
      totalEpisodes: number;
    }>;
    watchedEpisodes: Array<{
      id: number;
      seasonNumber: number;
      episodeNumber: number;
      watchedAt: string;
    }>;
  };
}

interface ImportConfirmationSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ImportConfirmationSheet({
  onConfirm,
  onCancel,
}: ImportConfirmationSheetProps) {
  const sheetRef = useSheetRef();
  const handleSheetChanges = useHandleSheetChanges();

  React.useEffect(() => {
    sheetRef.current?.present();
  }, []);

  const handleConfirm = useCallback(() => {
    sheetRef.current?.close();
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    sheetRef.current?.close();
    onCancel();
  }, [onCancel]);

  return (
    <Sheet ref={sheetRef} onChange={handleSheetChanges}>
      <BottomSheetView className="flex-1 px-6 py-4 text-center items-center">
        <ThemedText className="text-2xl font-inter-semibold mb-4">
          Warning
        </ThemedText>
        <ThemedText className="text-center mb-6">
          Importing a CSV will override all your existing watchlists, custom
          lists, and progress information. This action cannot be undone.
        </ThemedText>
        <View className="flex gap-4 w-full">
          <TouchableOpacity
            className="bg-red-500 rounded-lg p-4"
            onPress={handleConfirm}
          >
            <ThemedText className="text-center">
              Yes, Import and Override
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary-200/50 rounded-lg p-4"
            onPress={handleCancel}
          >
            <ThemedText className="text-center">Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </Sheet>
  );
}

export function WatchlistExportImportSheet() {
  const sheetRef = useSheetRef();
  const { movies, tvShows, importFromCSV } = useWatchlistStore();
  const watchedEpisodesStore = useWatchedEpisodesStore();
  const customListsStore = useCustomListsStore();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingImportContent, setPendingImportContent] = React.useState<
    string | null
  >(null);
  const handleSheetChanges = useHandleSheetChanges();

  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const handleExport = useCallback(async () => {
    // Check if all lists are empty
    if (
      movies.length === 0 &&
      tvShows.length === 0 &&
      customListsStore.lists.length === 0
    ) {
      showToast("Cannot export empty watchlists");
      handleClose();
      return;
    }

    const lists = {
      movies,
      tvShows,
    };

    let csvContent = Object.entries(lists)
      .map(([listName, items]) => {
        const header = "id,title,poster_path,release_date,vote_average";
        const rows = items
          .map(
            (item) =>
              `${item.id},"${item.title}","${item.poster_path}","${item.release_date}",${item.vote_average}`,
          )
          .join("\n");
        return `${listName}\n${header}\n${rows}\n\n`;
      })
      .join("");

    // Add custom lists data
    csvContent += "customLists\n";
    csvContent += "id,name,items\n";
    csvContent += customListsStore.lists
      .map((list) => {
        return `${list.id},"${list.name}","${JSON.stringify(list.items).replace(/"/g, '""')}"`;
      })
      .join("\n");
    csvContent += "\n\n";

    // Add watched episodes data
    const watchedEpisodesData = watchedEpisodesStore.shows;
    csvContent += "watchedEpisodes\n";
    csvContent += "showId,showName,seasons,watchedEpisodes\n";
    csvContent += Object.entries(watchedEpisodesData)
      .map(([showId, show]) => {
        return `${showId},"${show.showName}","${JSON.stringify(show.seasons).replace(/"/g, '""')}","${JSON.stringify(show.watchedEpisodes).replace(/"/g, '""')}"`;
      })
      .join("\n");

    const fileName = `watchlists_${new Date().toISOString().split("T")[0]}.csv`;
    const downloadsDir = FileSystem.documentDirectory + "Downloads/";
    const filePath = downloadsDir + fileName;

    try {
      // Create Downloads directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, {
          intermediates: true,
        });
      }

      await FileSystem.writeAsStringAsync(filePath, csvContent);
      showToast(`Watchlists exported to Downloads/${fileName}`);
      handleClose();
    } catch (error) {
      console.error("Error exporting watchlists:", error);
      showToast("Error exporting watchlists");
    }
  }, [
    movies,
    tvShows,
    watchedEpisodesStore.shows,
    customListsStore.lists,
    handleClose,
  ]);

  const handleImport = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
      );

      if (!isValidWatchlistCSV(fileContent)) {
        showToast("Invalid watchlist file format");
        return;
      }

      setPendingImportContent(fileContent);
      setShowConfirmation(true);
      handleClose();
    } catch (error) {
      console.error("Error importing watchlists:", error);
      showToast("Error importing watchlists");
    }
  }, [handleClose]);

  const handleConfirmImport = useCallback(async () => {
    if (!pendingImportContent) return;

    try {
      const sections = pendingImportContent.split("\n\n").filter(Boolean);

      // First import watchlists
      await importFromCSV(pendingImportContent);

      // Import custom lists if present
      const customListsSection = sections.find((section) =>
        section.startsWith("customLists"),
      );
      if (customListsSection) {
        const [_, , ...rows] = customListsSection.split("\n").filter(Boolean);

        // Clear existing custom lists
        customListsStore.lists.forEach((list) => {
          customListsStore.deleteList(list.id);
        });

        // Import new custom lists
        for (const row of rows) {
          const [_, name, items] = row
            .split(",")
            .map((val) =>
              val.startsWith('"') && val.endsWith('"') ? val.slice(1, -1) : val,
            );

          const listId = customListsStore.createList(name);
          const parsedItems = JSON.parse(items.replace(/""/g, '"'));
          parsedItems.forEach((item: AddToWatchlistProps) => {
            customListsStore.addToList(listId, item);
          });
        }
      }

      // Import watched episodes if present
      const watchedEpisodesSection = sections.find((section) =>
        section.startsWith("watchedEpisodes"),
      );
      if (watchedEpisodesSection) {
        const [_, , ...rows] = watchedEpisodesSection
          .split("\n")
          .filter(Boolean);
        const watchedEpisodesData: WatchedEpisodesData = {};

        for (const row of rows) {
          const [showId, showName, seasons, watchedEpisodes] = row
            .split(",")
            .map((val) =>
              val.startsWith('"') && val.endsWith('"') ? val.slice(1, -1) : val,
            );

          watchedEpisodesData[showId] = {
            showId: parseInt(showId),
            showName,
            seasons: JSON.parse(seasons.replace(/""/g, '"')),
            watchedEpisodes: JSON.parse(watchedEpisodes.replace(/""/g, '"')),
          };
        }

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(watchedEpisodesData),
        );
        watchedEpisodesStore.initialize();
      }

      showToast("Watchlists imported successfully");
      setShowConfirmation(false);
      setPendingImportContent(null);
    } catch (error) {
      console.error("Error importing watchlists:", error);
      showToast("Error importing watchlists");
    }
  }, [
    pendingImportContent,
    importFromCSV,
    customListsStore,
    watchedEpisodesStore,
  ]);

  const handleCancelImport = useCallback(() => {
    setShowConfirmation(false);
    setPendingImportContent(null);
  }, []);

  return (
    <View>
      <TouchableOpacity
        hitSlop={hitSlop}
        onPress={handlePresentModalPress}
        className="flex flex-row items-center gap-2"
      >
        <MaterialIcons name="file-upload" size={24} color="#fff" />
      </TouchableOpacity>

      <Sheet ref={sheetRef} onChange={handleSheetChanges}>
        <BottomSheetView className="flex-1 px-6 py-4 text-center items-center">
          <ThemedText className="text-2xl font-inter-semibold mb-4">
            Watchlist Options
          </ThemedText>
          <View className="flex gap-4 w-full">
            <TouchableOpacity
              className="bg-primary-200/50 rounded-lg p-4"
              onPress={handleImport}
            >
              <ThemedText className={"text-center"}>
                Import List from CSV
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary-200/50 rounded-lg p-4"
              onPress={handleExport}
            >
              <ThemedText className={"text-center"}>
                Export Lists to CSV
              </ThemedText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </Sheet>

      {showConfirmation && (
        <ImportConfirmationSheet
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}
    </View>
  );
}

import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";
import { WATCHED_EPISODES_STORAGE_KEY } from "@/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const isValidWatchlistCSV = (content: string): boolean => {
  try {
    const sections = content.split("\n\n").filter(Boolean);
    if (sections.length === 0) return false;

    for (const section of sections) {
      const [listName, header, ...rows] = section.split("\n").filter(Boolean);

      // Validate list name
      if (!["movies", "tvShows", "watchedEpisodes"].includes(listName))
        return false;

      // Validate header based on section
      if (listName === "watchedEpisodes") {
        if (header !== "showId,showName,seasons,watchedEpisodes") return false;
      } else {
        if (header !== "id,title,poster_path,release_date,vote_average")
          return false;
      }

      // Skip row validation for watched episodes as it's a complex object
      if (listName === "watchedEpisodes") continue;

      // Validate each row for movies and tvShows
      for (const row of rows) {
        const parts = row.split(",");
        if (parts.length !== 5) return false;

        // Check if id is a number
        if (isNaN(parseInt(parts[0]))) return false;

        // Check if vote_average is a number
        if (isNaN(parseFloat(parts[4]))) return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const WatchlistExportImportSheet = React.forwardRef<BottomSheetModal>(
  (_, ref) => {
    const { movies, tvShows, importFromCSV } = useWatchlistStore();
    const watchedEpisodesStore = useWatchedEpisodesStore();
    const handleSheetChanges = useHandleSheetChanges();

    const handleExport = useCallback(async () => {
      // Check if both lists are empty
      if (movies.length === 0 && tvShows.length === 0) {
        showToast("Cannot export empty watchlists");
        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
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

        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
      } catch (error) {
        console.error("Error exporting watchlists:", error);
        showToast("Error exporting watchlists");
      }
    }, [movies, tvShows, watchedEpisodesStore.shows]);

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

        const sections = fileContent.split("\n\n").filter(Boolean);

        // First import watchlists
        await importFromCSV(fileContent);

        // Then import watched episodes if present
        const watchedEpisodesSection = sections.find((section) =>
          section.startsWith("watchedEpisodes"),
        );
        if (watchedEpisodesSection) {
          const [_, header, ...rows] = watchedEpisodesSection
            .split("\n")
            .filter(Boolean);
          const watchedEpisodesData: WatchedEpisodesData = {};

          for (const row of rows) {
            const [showId, showName, seasons, watchedEpisodes] = row
              .split(",")
              .map((val) =>
                val.startsWith('"') && val.endsWith('"')
                  ? val.slice(1, -1)
                  : val,
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

        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
      } catch (error) {
        console.error("Error importing watchlists:", error);
        showToast("Error importing watchlists");
      }
    }, [importFromCSV, watchedEpisodesStore]);

    return (
      <Sheet ref={ref} onChange={handleSheetChanges}>
        <BottomSheetView className="flex-1 px-6 py-4">
          <ThemedText className="text-2xl font-inter-semibold mb-4">
            Watchlist Options
          </ThemedText>
          <View className="flex gap-4">
            <TouchableOpacity
              className="bg-primary-200/50 rounded-lg p-4"
              onPress={handleImport}
            >
              <ThemedText>Import List from CSV</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary-200/50 rounded-lg p-4"
              onPress={handleExport}
            >
              <ThemedText>Export Lists to CSV</ThemedText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </Sheet>
    );
  },
);

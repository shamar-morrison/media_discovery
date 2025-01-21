import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useWatchlistStore } from "@/store/watchlist-store";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/nativewindui/Sheet";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";

const isValidWatchlistCSV = (content: string): boolean => {
  try {
    const sections = content.split("\n\n").filter(Boolean);
    if (sections.length === 0) return false;

    for (const section of sections) {
      const [listName, header, ...rows] = section.split("\n").filter(Boolean);

      // Validate list name
      if (!["movies", "tvShows"].includes(listName)) return false;

      // Validate header
      if (header !== "id,title,poster_path,release_date,vote_average")
        return false;

      // Validate each row
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

      const csvContent = Object.entries(lists)
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
    }, [movies, tvShows]);

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

        await importFromCSV(fileContent);
        showToast("Watchlists imported successfully");

        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
      } catch (error) {
        console.error("Error importing watchlists:", error);
        showToast("Error importing watchlists");
      }
    }, [importFromCSV]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionText: {
    fontSize: 16,
  },
  bottomSheetBackground: {
    backgroundColor: "#1d1d1d",
  },
  handleIndicator: {
    backgroundColor: "#333",
  },
});

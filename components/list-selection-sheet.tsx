import { useCustomListsStore } from "@/store/custom-lists-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { MediaType } from "@/types/multi-search";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Button } from "./button";
import { Sheet, useSheetRef } from "./nativewindui/Sheet";
import { ThemedText } from "./themed-text";

interface ListSelectionSheetProps {
  mediaItem: AddToWatchlistProps;
  onComplete?: () => void;
  sheetRef: ReturnType<typeof useSheetRef>;
}

export function ListSelectionSheet({
  mediaItem,
  onComplete,
  sheetRef,
}: ListSelectionSheetProps) {
  const inputRef = useRef<TextInput>(null);
  const newListNameRef = useRef("");
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const lists = useCustomListsStore((state) => state.lists);
  const createList = useCustomListsStore((state) => state.createList);
  const addToList = useCustomListsStore((state) => state.addToList);
  const removeFromList = useCustomListsStore((state) => state.removeFromList);
  const isInList = useCustomListsStore((state) => state.isInList);

  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist,
  );
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);
  const handleSheetChanges = useHandleSheetChanges();

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, [sheetRef]);

  const updateSelectedLists = useCallback(() => {
    const newSelected = new Set<string>();
    if (isInWatchlist(mediaItem.id, mediaItem.mediaType)) {
      newSelected.add("default");
    }
    lists.forEach((list) => {
      if (isInList(list.id, mediaItem.id)) {
        newSelected.add(list.id);
      }
    });
    setSelectedLists(newSelected);
  }, [lists, mediaItem, isInWatchlist, isInList]);

  // Update selected lists when screen is focused
  useFocusEffect(
    useCallback(() => {
      updateSelectedLists();
    }, [updateSelectedLists]),
  );

  // Initialize selected state
  useEffect(() => {
    updateSelectedLists();
  }, [updateSelectedLists]);

  const handleCreateList = useCallback(() => {
    const newListName = newListNameRef.current.trim();
    if (!newListName) {
      showToast("Please enter a list name");
      return;
    }
    const listId = createList(newListName);
    setSelectedLists((prev) => new Set(prev).add(listId));
    newListNameRef.current = "";
    if (inputRef.current) {
      inputRef.current.clear();
    }
    showToast("New list created");
  }, [createList]);

  const handleTextChange = useCallback((text: string) => {
    newListNameRef.current = text;
  }, []);

  const toggleList = useCallback((listId: string) => {
    setSelectedLists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  }, []);

  const handleUpdateLists = useCallback(async () => {
    try {
      // Disable any further interactions while updating
      const operations = [];

      // Handle default list
      const wasInDefault = isInWatchlist(mediaItem.id, mediaItem.mediaType);
      const shouldBeInDefault = selectedLists.has("default");

      if (wasInDefault && !shouldBeInDefault) {
        operations.push(removeFromWatchlist(mediaItem.id, mediaItem.mediaType));
      } else if (!wasInDefault && shouldBeInDefault) {
        operations.push(addToWatchlist(mediaItem, mediaItem.mediaType));
      }

      // Handle custom lists
      for (const list of lists) {
        const wasInList = isInList(list.id, mediaItem.id);
        const shouldBeInList = selectedLists.has(list.id);

        if (wasInList && !shouldBeInList) {
          operations.push(
            Promise.resolve(removeFromList(list.id, mediaItem.id)),
          );
        } else if (!wasInList && shouldBeInList) {
          operations.push(Promise.resolve(addToList(list.id, mediaItem)));
        }
      }

      // Wait for all operations to complete before closing
      await Promise.all(operations);

      // Small delay to ensure state updates are processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      handleClose();
      showToast("Lists updated successfully");
      onComplete?.();
    } catch (error: any) {
      showToast("Error updating lists: " + error.message);
    }
  }, [selectedLists, lists, mediaItem, handleClose, onComplete]);

  return (
    <Sheet ref={sheetRef} onChange={handleSheetChanges} enableDynamicSizing>
      <BottomSheetView className="p-4">
        <ThemedText className="text-xl font-bold mb-4">
          Save to Lists
        </ThemedText>

        {/* New List Creation */}
        <View className="flex-row items-center gap-2 mb-4">
          <TextInput
            ref={inputRef}
            className="flex-1 bg-gray-800 p-4 rounded-lg text-white"
            placeholder="Create New List"
            placeholderTextColor="#666"
            onChangeText={handleTextChange}
            defaultValue=""
          />
          <Pressable
            className="bg-gray-800 p-4 rounded-lg"
            onPress={handleCreateList}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
        </View>

        <ScrollView
          className="mb-4"
          showsVerticalScrollIndicator
          style={{ maxHeight: 300 }} // This will allow about 5 items before scrolling
        >
          {/* Default List Option */}
          <Pressable
            className="flex-row items-center justify-between p-4 bg-gray-800 rounded-lg mb-2"
            onPress={() => toggleList("default")}
          >
            <ThemedText className="text-lg">
              {mediaItem.mediaType === MediaType.Movie ? "Movies" : "TV Shows"}
            </ThemedText>
            {selectedLists.has("default") && (
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            )}
          </Pressable>

          {/* Custom Lists */}
          {lists.map((list) => (
            <Pressable
              key={list.id}
              className="flex-row items-center justify-between p-4 bg-gray-800 rounded-lg mb-2"
              onPress={() => toggleList(list.id)}
            >
              <ThemedText className="text-lg">{list.name}</ThemedText>
              {selectedLists.has(list.id) && (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              )}
            </Pressable>
          ))}
        </ScrollView>

        <Button className="w-full" onPress={handleUpdateLists}>
          <ThemedText>Update Lists</ThemedText>
        </Button>
      </BottomSheetView>
    </Sheet>
  );
}

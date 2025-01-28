import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CustomList {
  id: string;
  name: string;
  items: AddToWatchlistProps[];
}

interface CustomListsStore {
  lists: CustomList[];
  createList: (name: string) => string;
  addToList: (listId: string, item: AddToWatchlistProps) => void;
  removeFromList: (listId: string, itemId: number) => void;
  deleteList: (listId: string) => void;
  isInList: (listId: string, itemId: number) => boolean;
}

export const useCustomListsStore = create<CustomListsStore>()(
  persist(
    (set, get) => ({
      lists: [],
      createList: (name: string) => {
        const id = Date.now().toString();
        set((state) => ({
          lists: [...state.lists, { id, name, items: [] }],
        }));
        return id;
      },
      addToList: (listId: string, item: AddToWatchlistProps) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.some((i) => i.id === item.id)
                    ? list.items
                    : [...list.items, item],
                }
              : list,
          ),
        }));
      },
      removeFromList: (listId: string, itemId: number) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                }
              : list,
          ),
        }));
      },
      deleteList: (listId: string) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
        }));
      },
      isInList: (listId: string, itemId: number) => {
        const list = get().lists.find((l) => l.id === listId);
        return list ? list.items.some((item) => item.id === itemId) : false;
      },
    }),
    {
      name: "custom-lists-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

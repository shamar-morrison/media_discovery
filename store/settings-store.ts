import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "@/utils/toast";

export type TvShowRemovalPreference =
  | "with_progress"
  | "without_progress"
  | undefined;

interface SettingsStore {
  tvShowRemovalPreference: TvShowRemovalPreference;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setTvShowRemovalPreference: (
    preference: TvShowRemovalPreference,
  ) => Promise<void>;
  resetTvShowRemovalPreference: () => Promise<void>;
}

const TV_SHOW_REMOVAL_PREFERENCE_KEY = "TV_SHOW_REMOVAL_PREFERENCE";

export const useSettingsStore = create<SettingsStore>((set, _) => ({
  tvShowRemovalPreference: undefined,
  isLoading: true,

  initialize: async () => {
    try {
      const storedPreference = await AsyncStorage.getItem(
        TV_SHOW_REMOVAL_PREFERENCE_KEY,
      );
      set({
        tvShowRemovalPreference: storedPreference as TvShowRemovalPreference,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      showToast("Error loading settings");
      set({ isLoading: false });
    }
  },

  setTvShowRemovalPreference: async (preference: TvShowRemovalPreference) => {
    try {
      if (preference) {
        await AsyncStorage.setItem(TV_SHOW_REMOVAL_PREFERENCE_KEY, preference);
      } else {
        await AsyncStorage.removeItem(TV_SHOW_REMOVAL_PREFERENCE_KEY);
      }
      set({ tvShowRemovalPreference: preference });
    } catch (error) {
      console.error("Error saving removal preference:", error);
      showToast("Error saving removal preference");
    }
  },

  resetTvShowRemovalPreference: async () => {
    try {
      await AsyncStorage.removeItem(TV_SHOW_REMOVAL_PREFERENCE_KEY);
      set({ tvShowRemovalPreference: undefined });
      showToast("TV show removal preference has been reset");
    } catch (error) {
      console.error("Error resetting removal preference:", error);
      showToast("Error resetting removal preference");
    }
  },
}));

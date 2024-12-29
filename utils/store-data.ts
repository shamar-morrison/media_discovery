import AsyncStorage from "@react-native-async-storage/async-storage";
import { MediaType } from "@/types/multi-search";
import { MOVIES_STORAGE_KEY, TV_SHOW_STORAGE_KEY } from "@/utils/constants";
import { showToast } from "@/utils/toast";

export const storeData = async (value: any, mediaType: MediaType) => {
  const key =
    mediaType === MediaType.Movie ? MOVIES_STORAGE_KEY : TV_SHOW_STORAGE_KEY;

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    showToast("Error storing data: " + e.message);
    throw new Error(e);
  }
};

import { getNumColumns } from "@/utils/get-num-columns";
import { Dimensions } from "react-native";

/** The size of the poster images */
export const POSTER_SIZE = "w500";

export const MEDIA_CARD_WIDTH = 100; // 100 just works for me

export const MEDIA_CARD_PADDING = 10;

export const HORIZONTAL_PADDING = 8;

export const NUM_COLUMNS = getNumColumns(
  Dimensions.get("window").width,
  MEDIA_CARD_WIDTH,
  MEDIA_CARD_PADDING,
);

export const MOVIES_STORAGE_KEY = "movies";
export const TV_SHOW_STORAGE_KEY = "tv";
export const WATCHED_EPISODES_STORAGE_KEY = "WATCHED_EPISODES_STORAGE_KEY";

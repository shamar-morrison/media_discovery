import { Dimensions } from "react-native";
import {
  HORIZONTAL_PADDING,
  MEDIA_CARD_PADDING,
  MEDIA_CARD_WIDTH,
} from "@/utils/constants";
import { getNumColumns } from "@/utils/get-num-columns";

const width = Dimensions.get("window").width;
const numColumns = getNumColumns(width, MEDIA_CARD_WIDTH, MEDIA_CARD_PADDING);

// Calculate item width based on container width and padding
export const itemWidth =
  (width - HORIZONTAL_PADDING * (numColumns - 1)) / numColumns;

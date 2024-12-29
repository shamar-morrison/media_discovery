import { View, Text, Dimensions, useWindowDimensions } from "react-native";
import React from "react";
import { getNumColumns } from "@/utils/get-num-columns";
import {
  HORIZONTAL_PADDING,
  MEDIA_CARD_PADDING,
  MEDIA_CARD_WIDTH,
} from "@/utils/constants";

type RenderItemWrapperProps = {
  index: number;
  children: React.ReactNode;
};

export function RenderItemWrapper({ index, children }: RenderItemWrapperProps) {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = getNumColumns(
    screenWidth,
    MEDIA_CARD_WIDTH,
    MEDIA_CARD_PADDING,
  );
  const isFirstInRow = index % numColumns === 0;
  const isLastInRow = (index + 1) % numColumns === 0;

  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: isFirstInRow ? 0 : HORIZONTAL_PADDING / 2,
        paddingRight: isLastInRow ? 0 : HORIZONTAL_PADDING / 2,
      }}
    >
      {children}
    </View>
  );
}

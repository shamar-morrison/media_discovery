import { MediaCard } from "@/components/media-card";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFavoritesStore } from "@/store/favorites-store";
import { NUM_COLUMNS } from "@/utils/constants";
import { itemWidth } from "@/utils/get-item-width";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";

export function FavoritesTab() {
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <ThemedView>
      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-lg">No favorites yet</ThemedText>
        </View>
      ) : (
        <FlashList
          data={favorites}
          renderItem={({ item, index }) => {
            return (
              <RenderItemWrapper index={index}>
                <MediaCard
                  containerHeight={165}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  release_date={item.release_date}
                  title={item.title}
                  id={item.id}
                  mediaType={item.mediaType}
                  containerWidth={itemWidth}
                />
              </RenderItemWrapper>
            );
          }}
          numColumns={NUM_COLUMNS}
          estimatedItemSize={160}
        />
      )}
    </ThemedView>
  );
}

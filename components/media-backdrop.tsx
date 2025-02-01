import { AddToWatchlistButton } from "@/components/add-to-watchlist-button";
import { Badge } from "@/components/badge";
import { PlayTrailerButton } from "@/components/play-trailer-button";
import { ThemedImage } from "@/components/themed-image";
import { ThemedText } from "@/components/themed-text";
import { useFavoritesStore } from "@/store/favorites-store";
import { Site, Videos, VideoType } from "@/types/movie-details";
import { MediaType } from "@/types/multi-search";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { formatMinutes } from "@/utils/format-minutes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type BackdropProps = {
  backdrop_path: string;
  id: number;
  poster_path: string;
  release_date: Date | undefined;
  runtime: number | number[];
  title: string;
  vote_average: number;
  videos: Videos;
  mediaType: MediaType;
  status?: string;
};

export function MediaBackdrop({
  backdrop_path,
  id,
  poster_path,
  release_date,
  runtime,
  title,
  vote_average,
  videos,
  mediaType,
  status,
}: BackdropProps) {
  const { isInFavorites, addToFavorites, removeFromFavorites } =
    useFavoritesStore();
  const isFavorite = isInFavorites(id);

  const handleFavoritePress = async () => {
    if (isFavorite) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites({
        id,
        title,
        poster_path,
        release_date,
        vote_average,
        mediaType,
      });
    }
  };

  let time;
  if (Array.isArray(runtime)) {
    time = runtime.length > 0 ? `${runtime[0]} mins per episode` : "N/A";
  } else {
    time = formatMinutes(runtime);
  }
  return (
    <>
      <View className="bg-black h-[400px] w-screen absolute z-10 opacity-70" />
      {status === "Ended" && (
        <View className="absolute top-3 left-3 z-30 opacity-50">
          <Badge text={"Ended"} variant={"red"} />
        </View>
      )}
      <ThemedImage
        source={createMediaImageLink("w1280", backdrop_path)}
        style={{ width: "100%", height: 400 }}
        contentFit={"cover"}
        cachePolicy={"memory"}
      />

      <TouchableOpacity
        onPress={handleFavoritePress}
        className={"absolute right-5 top-5 z-30"}
        hitSlop={10}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={30}
          color={"#fff"}
        />
      </TouchableOpacity>

      <View className="absolute bottom-[40px] w-full px-4 z-10">
        <View className="flex items-center">
          {vote_average && (
            <View className={"flex flex-row gap-1 items-center mb-0.5"}>
              <Ionicons name={"star"} size={12} color={"#ffd500"} />
              <ThemedText className={"color-gold"}>
                {vote_average.toFixed(1)}
              </ThemedText>
            </View>
          )}
          <ThemedText
            className="font-inter-semibold text-3xl text-center"
            numberOfLines={3}
          >
            {title}
          </ThemedText>
          <View className="flex gap-2 mt-2 justify-center">
            <View className="flex flex-row justify-center">
              <ThemedText className="text-center">
                {release_date ? format(release_date, "MMM. dd, yyyy") : "N/A"}
              </ThemedText>
              <ThemedText className="text-center"> • </ThemedText>
              <ThemedText className="text-center">{time}</ThemedText>
            </View>
            <View className="flex flex-col items-center w-full gap-4">
              <View className="w-[265px] h-[40px]">
                <AddToWatchlistButton
                  title={title}
                  poster_path={poster_path}
                  vote_average={vote_average}
                  id={id}
                  release_date={release_date}
                  mediaType={mediaType}
                />
              </View>
              <View className="w-[265px] h-[40px]">
                <PlayTrailerButton
                  videoId={
                    videos.results.find(
                      (video) =>
                        video.site === Site.YouTube &&
                        video.type === VideoType.Trailer,
                    )?.key
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

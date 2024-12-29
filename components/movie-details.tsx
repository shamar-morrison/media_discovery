import { View } from "react-native";
import React from "react";
import { MovieDetailsResponse, Site } from "@/types/movie-details";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedText } from "@/components/themed-text";
import { formatDate } from "@/utils/format-date";
import { formatMinutes } from "@/utils/format-minutes";
import AddToWatchlistButton from "@/components/add-to-watchlist-button";
import PlayTrailerButton from "@/components/play-trailer-button";
import { Section } from "@/components/section";
import { FlashList } from "@shopify/flash-list";
import { Video } from "@/components/video";
import { PersonCard } from "@/components/person-card";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";

export default function MovieDetails({
  title,
  release_date,
  runtime,
  backdrop_path,
  overview,
  videos,
  credits,
  similar,
}: MovieDetailsResponse) {
  return (
    <View>
      <View>
        <View className="bg-black h-[400px] w-screen absolute z-10 opacity-60" />
        <ThemedImage
          source={createMediaImageLink("w1280", backdrop_path)}
          style={{ width: "100%", height: 400 }}
          contentFit={"cover"}
          cachePolicy={"memory"}
        />

        <View
          className={
            "absolute bottom-[40px] left-1/2 transform -translate-x-1/2 flex justify-center z-10 px-4"
          }
        >
          <ThemedText
            className={"font-inter-semibold text-3xl text-center"}
            numberOfLines={3}
          >
            {title}
          </ThemedText>
          <View className={"flex gap-2 mt-2 justify-center"}>
            <View className={"flex flex-row justify-center"}>
              <ThemedText className={"text-center"}>
                {formatDate(release_date)}
              </ThemedText>
              <ThemedText className={"text-center"}> • </ThemedText>
              <ThemedText className={"text-center"}>
                {formatMinutes(runtime)}
              </ThemedText>
            </View>
            <View className={"flex gap-2 justify-center px-4"}>
              <View className="flex-1">
                <AddToWatchlistButton />
              </View>
              <View className="flex-1">
                <PlayTrailerButton />
              </View>
            </View>
          </View>
        </View>
      </View>

      <Section title={"About"}>
        <ThemedText
          className={"pt-3 text-black-50 leading-[1.50rem]"}
          numberOfLines={5}
        >
          {overview}
        </ThemedText>
      </Section>

      <Section title={"Videos"}>
        {videos.results.length === 0 && (
          <ThemedText className={"mt-4"}>No videos found</ThemedText>
        )}
        {videos.results.length > 0 && (
          <FlashList
            estimatedItemSize={100}
            className={"mt-4"}
            data={videos.results.filter((video) => video.site === Site.YouTube)}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item }) => (
              <Video type={item.type} name={item.name} videoKey={item.key} />
            )}
          />
        )}
      </Section>

      <Section title={"Cast"}>
        {credits.cast.length === 0 && (
          <ThemedText className={"mt-4"}>No cast found</ThemedText>
        )}
        {credits.cast.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={100}
            className={"mt-4"}
            data={credits.cast}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item }) => <PersonCard {...item} />}
          />
        )}
      </Section>

      <Section title={"More Like This"}>
        {similar.results.length === 0 && (
          <ThemedText className={"mt-4"}>No similar movies found</ThemedText>
        )}
        {similar.results.length > 0 && (
          <FlashList
            estimatedItemSize={100}
            className={"mt-4"}
            data={similar.results}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item }) => (
              <MediaCard
                containerHeight={165}
                containerWidth={120}
                posterPath={item.poster_path}
                rating={item.vote_average}
                title={item.title}
                id={item.id}
                mediaType={MediaType.Movie}
              />
            )}
          />
        )}
      </Section>
    </View>
  );
}

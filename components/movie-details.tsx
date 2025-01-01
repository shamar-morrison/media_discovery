import { View } from "react-native";
import { MovieDetailsResponse, Site, VideoType } from "@/types/movie-details";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedText } from "@/components/themed-text";
import { formatMinutes } from "@/utils/format-minutes";
import { AddToWatchlistButton } from "@/components/add-to-watchlist-button";
import { PlayTrailerButton } from "@/components/play-trailer-button";
import { Section } from "@/components/section";
import { FlashList } from "@shopify/flash-list";
import { Video } from "@/components/video";
import { PersonCard } from "@/components/person-card";
import { MediaType } from "@/types/multi-search";
import { SimilarMovieCard } from "@/components/similar-movie-card";
import { format } from "date-fns";
import { Badge } from "@/components/badge";

export function MovieDetails({
  title,
  release_date,
  runtime,
  backdrop_path,
  overview,
  videos,
  credits,
  similar,
  id,
  poster_path,
  vote_average,
  genres,
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

        <View className="absolute bottom-[40px] w-full px-4 z-10">
          <View className="flex items-center">
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
                <ThemedText className="text-center">
                  {formatMinutes(runtime)}
                </ThemedText>
              </View>
              <View className="flex flex-col items-center w-full gap-4">
                <View className="w-[265px] h-[40px]">
                  <AddToWatchlistButton
                    title={title}
                    poster_path={poster_path}
                    vote_average={vote_average}
                    id={id}
                    release_date={release_date}
                    mediaType={MediaType.Movie}
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
      </View>

      <Section title={"About"}>
        <ThemedText
          className={"pt-3 text-black-50 leading-[1.50rem]"}
          numberOfLines={5}
        >
          {overview || "No overview found"}
        </ThemedText>
        {genres.length > 0 && (
          <View className={"mt-2 flex flex-row flex-wrap gap-2"}>
            {genres.map((genre) => (
              <Badge key={genre.id} text={genre.name} />
            ))}
          </View>
        )}
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
            estimatedItemSize={10}
            className={"mt-4"}
            data={credits.cast}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === credits.cast.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <PersonCard {...item} />
                </View>
              );
            }}
          />
        )}
      </Section>

      <Section
        title={"More Like This"}
        id={id}
        mediaType={MediaType.Movie}
        showSeeAll={similar.results.length > 0}
        mediaTitle={title}
      >
        {similar.results.length === 0 && (
          <ThemedText className={"mt-4"}>No similar movies found</ThemedText>
        )}
        {similar.results.length > 0 && (
          <FlashList
            estimatedItemSize={10}
            className={"mt-4"}
            data={similar.results}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === similar.results.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SimilarMovieCard
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    title={item.title}
                    id={item.id}
                    release_date={item.release_date}
                    mediaType={MediaType.Movie}
                  />
                </View>
              );
            }}
          />
        )}
      </Section>
    </View>
  );
}

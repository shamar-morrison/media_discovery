import { View } from "react-native";
import { TvShowDetailsResponse } from "@/types/tv-show-details";
import { MediaBackdrop } from "@/components/media-backdrop";
import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { Badge } from "@/components/badge";
import { FlashList } from "@shopify/flash-list";
import { SeasonThumbnail } from "@/components/season-thumbnail";
import { PersonCard } from "@/components/person-card";
import { MediaType } from "@/types/multi-search";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Video } from "@/components/video";
import { Site } from "@/types/movie-details";
import { useEffect } from "react";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { showToast } from "@/utils/toast";

interface TvShowDetailsProps extends TvShowDetailsResponse {
  mediaType: MediaType;
}

export function TvShowDetails({
  name,
  overview,
  backdrop_path,
  poster_path,
  vote_average,
  first_air_date,
  genres,
  id: seriesId,
  videos,
  episode_run_time,
  seasons,
  credits,
  similar,
  mediaType,
  status,
}: TvShowDetailsProps) {
  const initialiseShow = useWatchedEpisodesStore(
    (state) => state.initializeShow,
  );

  // initialise show
  useEffect(() => {
    initialiseShow(
      seriesId,
      name,
      seasons.map((season) => {
        return {
          seasonNumber: season.season_number,
          totalEpisodes: season.episode_count,
        };
      }),
    ).catch((er: any) => showToast("Failed to initialise show" + er.message));
  }, []);

  return (
    <View>
      <View>
        <MediaBackdrop
          status={status}
          id={seriesId}
          poster_path={poster_path}
          backdrop_path={backdrop_path}
          title={name}
          vote_average={vote_average}
          release_date={first_air_date}
          runtime={episode_run_time}
          videos={videos}
          mediaType={mediaType}
        />
      </View>

      <Section title={"About"}>
        <ThemedText className={"pt-3 leading-[1.50rem]"} numberOfLines={5}>
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

      <Section title={"Seasons"}>
        {seasons.length === 0 && (
          <ThemedText className={"mt-4"}>No seasons found</ThemedText>
        )}
        {seasons.length > 0 && (
          <FlashList
            estimatedItemSize={seasons.length}
            className={"mt-4"}
            data={seasons}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === seasons.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SeasonThumbnail
                    {...item}
                    seriesId={seriesId}
                    seriesName={name}
                  />
                </View>
              );
            }}
          />
        )}
      </Section>

      <Section title={"Videos"}>
        {videos.results.length === 0 && (
          <ThemedText className={"mt-4"}>No videos found</ThemedText>
        )}
        {videos.results.length > 0 && (
          <FlashList
            estimatedItemSize={videos.results.length}
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
            estimatedItemSize={credits.cast.length}
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
        showSeeAll={similar.results.length > 0}
        mediaTitle={name}
        id={seriesId}
        mediaType={MediaType.Tv}
      >
        {similar.results.length === 0 && (
          <ThemedText className={"mt-4"}>No similar shows found</ThemedText>
        )}
        {similar.results.length > 0 && (
          <FlashList
            estimatedItemSize={similar.results.length}
            className={"mt-4"}
            data={similar.results}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === similar.results.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SecondaryMediaCard
                    title={item.name}
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    release_date={item.first_air_date}
                    id={item.id}
                    mediaType={MediaType.Tv}
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

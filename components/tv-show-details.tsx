import { AboutSection } from "@/components/about-section";
import { MediaBackdrop } from "@/components/media-backdrop";
import { SeasonThumbnail } from "@/components/season-thumbnail";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { VideosSection } from "@/components/videos-section";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { MediaType } from "@/types/multi-search";
import { SectionType } from "@/types/section";
import { TvShowDetailsResponse } from "@/types/tv-show-details";
import { showToast } from "@/utils/toast";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { View } from "react-native";
import { CastSection } from "@/components/cast-section";

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

      <AboutSection overview={overview} genres={genres} />

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

      <VideosSection videos={videos} />

      <CastSection
        title="Cast"
        cast={credits.cast.slice(0, 10)}
        showSeeAll={true}
        mediaType={mediaType}
        id={seriesId}
        sectionType={SectionType.Cast}
        mediaTitle={name}
      />

      <Section
        title={"More Like This"}
        showSeeAll={similar.results.length > 0}
        mediaTitle={name}
        id={seriesId}
        mediaType={MediaType.Tv}
        sectionType={SectionType.Similar}
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

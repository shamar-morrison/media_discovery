import { AboutSection } from "@/components/about-section";
import { MediaBackdrop } from "@/components/media-backdrop";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { VideosSection } from "@/components/videos-section";
import { MovieDetailsResponse } from "@/types/movie-details";
import { MediaType } from "@/types/multi-search";
import { SectionType } from "@/types/section";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { CastSection } from "@/components/cast-section";

interface MovieDetailsProps extends MovieDetailsResponse {
  mediaType: MediaType;
}

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
  mediaType,
}: MovieDetailsProps) {
  return (
    <View>
      <View>
        <MediaBackdrop
          id={id}
          poster_path={poster_path}
          backdrop_path={backdrop_path}
          title={title}
          vote_average={vote_average}
          release_date={release_date}
          runtime={runtime}
          videos={videos}
          mediaType={mediaType}
        />
      </View>

      <AboutSection genres={genres} overview={overview} />

      <VideosSection videos={videos} />

      <CastSection
        title="Cast"
        cast={credits.cast.slice(0, 10)}
        showSeeAll={true}
        mediaType={mediaType}
        id={id}
        sectionType={SectionType.Cast}
      />

      <Section
        title={"More Like This"}
        id={id}
        mediaType={MediaType.Movie}
        showSeeAll={similar.results.length > 0}
        mediaTitle={title}
        sectionType={SectionType.Similar}
      >
        {similar.results.length === 0 && (
          <ThemedText className={"mt-4"}>No similar movies found</ThemedText>
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

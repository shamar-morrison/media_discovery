import { View } from "react-native";
import { MovieDetailsResponse, Site } from "@/types/movie-details";
import { ThemedText } from "@/components/themed-text";
import { Section } from "@/components/section";
import { FlashList } from "@shopify/flash-list";
import { Video } from "@/components/video";
import { PersonCard } from "@/components/person-card";
import { MediaType } from "@/types/multi-search";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Badge } from "@/components/badge";
import { MediaBackdrop } from "@/components/media-backdrop";

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

      <Section title={"About"}>
        <ThemedText className={"pt-3 text-accent-100/85 leading-[1.50rem]"}>
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

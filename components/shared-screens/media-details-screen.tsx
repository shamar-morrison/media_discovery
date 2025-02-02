import { useLocalSearchParams } from "expo-router";
import { useGetMediaDetails } from "@/hooks/use-get-media-details";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { MediaType } from "@/types/multi-search";
import { MovieDetails } from "@/components/movie-details";
import { TvShowDetails } from "@/components/tv-show-details";
import { MovieDetailsResponse } from "@/types/movie-details";
import { TvShowDetailsResponse } from "@/types/tv-show-details";
import { ThemedText } from "@/components/themed-text";

export function MediaDetails() {
  const { mediaId, mediaType } = useLocalSearchParams<{
    mediaId: string;
    mediaType: MediaType;
  }>();

  const { data, isLoading, isError, refetch } = useGetMediaDetails<
    typeof mediaType
  >(mediaId, mediaType);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <Error
        message="Error loading media details. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (!mediaType) return <ThemedText>No media type was passed</ThemedText>;

  return (
    <ThemedScrollView>
      {mediaType === MediaType.Movie && (
        <MovieDetails
          {...(data as MovieDetailsResponse)}
          mediaType={MediaType.Movie}
        />
      )}
      {mediaType === MediaType.Tv && (
        <TvShowDetails
          {...(data as TvShowDetailsResponse)}
          mediaType={MediaType.Tv}
        />
      )}
    </ThemedScrollView>
  );
}

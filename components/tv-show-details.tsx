import { View } from "react-native";
import React from "react";
import { TvShowDetailsResponse } from "@/types/tv-show-details";
import { MediaBackdrop } from "@/components/media-backdrop";

export function TvShowDetails({
  name,
  overview,
  backdrop_path,
  poster_path,
  vote_average,
  first_air_date,
  genres,
  id,
  videos,
  episode_run_time,
}: TvShowDetailsResponse) {
  return (
    <View>
      <View>
        <MediaBackdrop
          id={id}
          poster_path={poster_path}
          backdrop_path={backdrop_path}
          title={name}
          vote_average={vote_average}
          release_date={first_air_date}
          runtime={episode_run_time}
          videos={videos}
        />
      </View>
    </View>
  );
}

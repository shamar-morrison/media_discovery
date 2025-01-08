import React from "react";
import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { Site, Videos } from "@/types/movie-details";
import { Video } from "@/components/video";

export function VideosSection({ videos }: { videos: Videos }) {
  return (
    <Section title={"Videos"}>
      {videos.results.length === 0 && (
        <ThemedText className={"mt-4"}>No videos found</ThemedText>
      )}
      {videos.results.length > 0 && (
        <FlashList
          estimatedItemSize={200}
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
  );
}

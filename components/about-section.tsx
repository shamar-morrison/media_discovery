import { View } from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { Badge } from "@/components/badge";
import { Section } from "@/components/section";
import { Genre } from "@/types/movie-details";

export function AboutSection({
  overview,
  genres,
}: {
  overview: string | undefined;
  genres: Genre[];
}) {
  const [lines, setLines] = useState<number | undefined>(5);
  return (
    <Section title={"About"}>
      <ThemedText
        className={"pt-3 leading-[1.50rem]"}
        numberOfLines={lines}
        onPress={() => setLines(undefined)}
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
  );
}

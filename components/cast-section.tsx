import { View } from "react-native";
import React from "react";
import { Cast } from "@/types/movie-details";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { PersonCard } from "@/components/person-card";
import { Section } from "@/components/section";

export function CastSection({ cast }: { cast: Cast[] }) {
  return (
    <Section title={"Cast"}>
      {cast.length === 0 && (
        <ThemedText className={"mt-4"}>No cast found</ThemedText>
      )}
      {cast.length > 0 && (
        <FlashList
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={130}
          className={"mt-4"}
          data={cast}
          canCancelContentTouches={false}
          horizontal={true}
          renderItem={({ item, index }) => {
            const isLastItem = index === cast.length - 1;

            return (
              <View className={`${!isLastItem ? "mr-3" : ""}`}>
                <PersonCard {...item} />
              </View>
            );
          }}
        />
      )}
    </Section>
  );
}

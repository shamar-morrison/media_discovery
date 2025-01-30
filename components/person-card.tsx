import { Text, View } from "react-native";
import { ThemedImage } from "@/components/themed-image";
import { useAppropriateImage } from "@/utils/use-appropriate-image";
import { Cast } from "@/types/movie-details";
import { Link } from "expo-router";

export function PersonCard({ name, character, profile_path, id, job }: Cast) {
  return (
    <Link
      href={{
        pathname: "/person/[personId]",
        params: { personId: id },
      }}
    >
      <View className="flex gap-2 w-32">
        <View className="rounded-lg overflow-hidden w-full">
          <ThemedImage
            style={{
              width: "100%",
              height: 155,
              borderRadius: 5,
            }}
            className={"w-full h-full"}
            contentFit={"cover"}
            source={useAppropriateImage(profile_path)}
          />
          <View className={"flex"}>
            <Text
              className={"text-white font-inter-semibold mt-1"}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className={"text-white font-inter text-sm opacity-50"}
              numberOfLines={1}
            >
              {character || job}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
}

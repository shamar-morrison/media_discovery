import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { MediaType } from "@/types/multi-search";
import { ncn } from "@/utils/ncn";
import { hitSlop } from "@/utils/hit-slop";

type SectionProps = {
  title: string;
  mediaTitle?: string;
  children?: React.ReactNode;
  showSeeAll?: boolean;
  mediaType?: MediaType;
  id?: number;
  className?: string;
};

export function Section({
  title,
  mediaTitle,
  children,
  showSeeAll,
  mediaType,
  id,
  className,
}: SectionProps) {
  return (
    <View
      className={ncn(
        "bg-black-100 px-4 py-8 border-b-[0.5px] border-accent-100/10",
        className,
      )}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6,
      }}
    >
      <View className="flex flex-row justify-between">
        <View className={"flex flex-row gap-2 items-center"}>
          <View className={"h-6 w-2 rounded-lg bg-primary-300"} />
          <ThemedText className={"text-2xl font-inter-medium"}>
            {title}
          </ThemedText>
        </View>
        {showSeeAll && id && mediaType && (
          <Pressable hitSlop={hitSlop} className={"flex flex-row items-center"}>
            <Link
              href={{
                pathname: "/similar/[similarId]",
                params: { similarId: id, mediaType, mediaTitle },
              }}
            >
              <View className="flex flex-row gap-1 items-center">
                <ThemedText className={"text-white/50 font-inter"}>
                  See All
                </ThemedText>
                <Ionicons
                  className={"relative top-[0.4px]"}
                  name={"arrow-forward"}
                  size={13}
                  color={"rgba(255,255,255,0.5)"}
                />
              </View>
            </Link>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

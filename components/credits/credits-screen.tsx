import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { PersonCard } from "@/components/person-card";
import { ThemedView } from "@/components/themed-view";
import { useGetMediaDetails } from "@/hooks/use-get-media-details";
import { MediaType } from "@/types/multi-search";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function CastTab() {
  const { id, mediaType } = useLocalSearchParams<{
    id: string;
    mediaType: MediaType;
  }>();

  const { data, isLoading, isError, refetch } = useGetMediaDetails(
    id,
    mediaType,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  return (
    <ThemedView>
      <FlashList
        data={data.credits.cast}
        renderItem={({ item }) => (
          <View className="p-2">
            <PersonCard {...item} />
          </View>
        )}
        numColumns={3}
        estimatedItemSize={200}
      />
    </ThemedView>
  );
}

function CrewTab() {
  const { id, mediaType } = useLocalSearchParams<{
    id: string;
    mediaType: MediaType;
  }>();

  const { data, isLoading, isError, refetch } = useGetMediaDetails(
    id,
    mediaType,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  return (
    <ThemedView>
      <FlashList
        data={data.credits.crew}
        renderItem={({ item }) => (
          <View className="p-2">
            <PersonCard {...item} />
          </View>
        )}
        numColumns={3}
        estimatedItemSize={200}
      />
    </ThemedView>
  );
}

export default function CreditsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarLabelStyle: { color: "#fff", fontFamily: "Inter" },
        tabBarIndicatorStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tab.Screen name="Cast" component={CastTab} />
      <Tab.Screen name="Crew" component={CrewTab} />
    </Tab.Navigator>
  );
}

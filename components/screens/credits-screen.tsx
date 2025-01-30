import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { PersonCard } from "@/components/person-card";
import { ThemedView } from "@/components/themed-view";
import { useGetMediaDetails } from "@/hooks/use-get-media-details";
import { MediaType } from "@/types/multi-search";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { tabStyles } from "@/styles/tab-styles";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { NUM_COLUMNS } from "@/utils/constants";
import { TabBarLabel } from "@/components/tab-bar-label";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";

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
        renderItem={({ item, index }) => (
          <RenderItemWrapper index={index}>
            <PersonCard {...item} />
          </RenderItemWrapper>
        )}
        numColumns={NUM_COLUMNS}
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
        renderItem={({ item, index }) => (
          <RenderItemWrapper index={index}>
            <PersonCard {...item} />
          </RenderItemWrapper>
        )}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={200}
      />
    </ThemedView>
  );
}

export default function CreditsScreen() {
  const { mediaTitle } = useLocalSearchParams<{ mediaTitle: string }>();
  return (
    <>
      <View className={"p-4 pb-0"}>
        <ScreenTitle>
          Credits for{" "}
          <ThemedText
            className={"text-3xl font-inter-semibold text-primary-300"}
          >
            {mediaTitle}
          </ThemedText>
        </ScreenTitle>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: tabStyles.tabBarScrollEnabled,
          tabBarIndicatorStyle: {
            backgroundColor: "#fff",
            height: 2,
          },
          tabBarActiveTintColor: tabStyles.tabBarActiveTintColor,
          tabBarInactiveTintColor: tabStyles.tabBarInactiveTintColor,
          tabBarStyle: tabStyles.tabBarStyle,
          sceneStyle: tabStyles.sceneStyle,
          animationEnabled: true,
          swipeEnabled: true,
          tabBarPressOpacity: 1,
          tabBarPressColor: "transparent",
        }}
        backBehavior={"none"}
      >
        <Tab.Screen
          name="CAST"
          component={CastTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Cast</TabBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="CREW"
          component={CrewTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Crew</TabBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

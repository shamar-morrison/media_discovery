import { tabStyles } from "@/styles/tab-styles";
import { LatestMoviesTab } from "@/components/latest-movies-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LatestTvShowsTab } from "@/components/latest-tv-shows-tab";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

// home screen
export default function Index() {
  return (
    <>
      <View className="px-4 pt-4">
        <ScreenTitle>Discover</ScreenTitle>
      </View>
      <Tab.Navigator screenOptions={tabStyles} backBehavior={"none"}>
        <Tab.Screen
          name="movies"
          component={LatestMoviesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Latest Movies</TabBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="tv"
          component={LatestTvShowsTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Latest TV Shows</TabBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

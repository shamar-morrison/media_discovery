import { tabStyles } from "@/styles/tab-styles";
import { MoviesTab } from "@/components/movies-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LatestTvShowsTab } from "@/components/latest-tv-shows-tab";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";
import { DrawerMenuButton } from "@/components/drawer-menu-button";

const Tab = createMaterialTopTabNavigator();

// home screen
export default function Index() {
  return (
    <>
      <View className="flex flex-row px-4 pt-4 bg-black-200 justify-between">
        <ScreenTitle>Discover</ScreenTitle>
        <DrawerMenuButton />
      </View>
      <Tab.Navigator screenOptions={tabStyles} backBehavior={"none"}>
        <Tab.Screen
          name="movies"
          children={() => <MoviesTab />}
          component={undefined}
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

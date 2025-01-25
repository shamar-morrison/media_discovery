import { DrawerMenuButton } from "@/components/drawer-menu-button";
import { LatestTvShowsTab } from "@/components/latest-tv-shows-tab";
import { MoviesTab } from "@/components/movies-tab";
import { ScreenTitle } from "@/components/screen-title";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

// home screen
export default function Index() {
  return (
    <>
      <View className="flex flex-row px-4 pt-4 bg-black-200 justify-between">
        <ScreenTitle>Discover</ScreenTitle>
        <DrawerMenuButton />
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

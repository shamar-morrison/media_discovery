import { ScreenTitle } from "@/components/screen-title";
import { FavoritesTab } from "@/components/screens/favorites-tab";
import { ProgressTab } from "@/components/screens/progress-tab";
import { WatchlistsTab } from "@/components/screens/watchlists-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { WatchlistExportImportSheet } from "@/components/watchlist-export-import-sheet";
import { tabStyles } from "@/styles/tab-styles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  return (
    <>
      <View className="p-4 flex flex-row items-center justify-between">
        <ScreenTitle className={"pb-0"}>Profile</ScreenTitle>
        <View className="flex gap-5 flex-row items-center">
          <WatchlistExportImportSheet />
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          ...tabStyles,
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarPressColor: "transparent",
          animationEnabled: true,
        }}
        backBehavior={"none"}
      >
        <Tab.Screen
          name="lists"
          component={WatchlistsTab}
          options={{
            swipeEnabled: false,
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Lists</TabBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="favorites"
          component={FavoritesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Favorites</TabBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="progress"
          component={ProgressTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Progress</TabBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { WatchlistsTab } from "@/components/screens/watchlists-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";
import { ProgressTab } from "@/components/screens/progress-tab";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { Pressable, View } from "react-native";
import { WatchlistExportImportSheet } from "@/components/watchlist-export-import-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  return (
    <>
      <View className="p-4 flex flex-row items-center justify-between">
        <ScreenTitle className={"pb-0"}>Profile</ScreenTitle>
        <View className="flex gap-5 flex-row items-center">
          <WatchlistExportImportSheet />
          <Pressable onPress={() => router.push("/settings")}>
            <Ionicons name={"settings"} size={23} color={"#fff"} />
          </Pressable>
        </View>
      </View>
      <Tab.Navigator screenOptions={tabStyles} backBehavior={"none"}>
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

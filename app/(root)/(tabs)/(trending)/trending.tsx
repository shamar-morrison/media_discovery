import { tabStyles } from "@/styles/tab-styles";
import { TabBarLabel } from "@/components/tab-bar-label";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";
import { TrendingMovies } from "@/app/(root)/(tabs)/(home)/trending-movies";
import { TrendingTV } from "@/app/(root)/(tabs)/(home)/trending-tv";

const Tab = createMaterialTopTabNavigator();

export default function Trending() {
  return (
    <>
      <View className="flex flex-row px-4 pt-4 bg-black-200 justify-between">
        <ScreenTitle>Trending</ScreenTitle>
      </View>
      <Tab.Navigator screenOptions={tabStyles} backBehavior={"none"}>
        <Tab.Screen
          name="trending-movies"
          children={() => <TrendingMovies />}
          component={undefined}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Trending Movies</TabBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="trending-tv"
          children={() => <TrendingTV />}
          component={undefined}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarLabel focused={focused}>Trending TV Shows</TabBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

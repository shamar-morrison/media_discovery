import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { tabStyles } from "@/styles/tab-styles";
import { MOVIE_GENRES } from "@/types/genres";
import { TabBarLabel } from "@/components/tab-bar-label";
import { MoviesTab } from "@/components/movies-tab";

const Tab = createMaterialTopTabNavigator();

export function MovieGenresTabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...tabStyles,
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 150 },
        lazy: true,
      }}
      backBehavior={"none"}
      style={{ flex: 1 }}
    >
      {Object.entries(MOVIE_GENRES).map(([name, obj]) => {
        return (
          <Tab.Screen
            key={obj.id + obj.name}
            name={name}
            children={() => <MoviesTab genreId={obj.id} />}
            component={undefined}
            options={{
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused}>{obj.name}</TabBarLabel>
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

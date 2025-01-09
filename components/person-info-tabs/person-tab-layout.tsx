import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { tabStyles } from "@/styles/tab-styles";
import { PersonDetailsTab } from "@/components/person-info-tabs/person-details-tab";
import { FilmographyMovies } from "@/components/person-info-tabs/filmography-movies";
import { FilmographyTvShows } from "@/components/person-info-tabs/filmography-tv-shows";
import { TabBarLabel } from "@/components/tab-bar-label";

const Tab = createMaterialTopTabNavigator();

export function PersonTabLayout() {
  const DetailsWrapper = () => <PersonDetailsTab />;
  const MoviesWrapper = () => <FilmographyMovies />;
  const TvShowsWrapper = () => <FilmographyTvShows />;

  return (
    <Tab.Navigator screenOptions={tabStyles}>
      <Tab.Screen
        name={"details"}
        component={DetailsWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Details</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name={"movies"}
        component={MoviesWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Movies</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name={"tv"}
        component={TvShowsWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>TV Shows</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

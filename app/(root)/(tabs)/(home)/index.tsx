import { tabStyles } from "@/styles/tab-styles";
import { LatestMoviesTab } from "@/components/latest-movies-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LatestTvShowsTab } from "@/components/latest-tv-shows-tab";

const Tab = createMaterialTopTabNavigator();

// home screen
export default function Index() {
  return (
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
          lazy: true,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Latest TV Shows</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";
import { OverviewTab } from "@/components/season-info-tabs/overview-tab";
import { EpisodesTab } from "@/components/season-info-tabs/episodes-tab";
import { Episode } from "@/types/season-details";

interface SeasonInfoTabLayoutProps {
  episodes: Episode[];
  overview: string;
}

const Tab = createMaterialTopTabNavigator();

export function SeasonInfoTabLayout({
  episodes,
  overview,
}: SeasonInfoTabLayoutProps) {
  const OverviewWrapper = () => <OverviewTab overview={overview} />;
  const EpisodesTabWrapper = () => <EpisodesTab episodes={episodes} />;

  return (
    <Tab.Navigator
      screenOptions={tabStyles}
      initialRouteName={"episodes"}
      backBehavior={"none"}
    >
      <Tab.Screen
        name="overview"
        component={OverviewWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Overview</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name="episodes"
        component={EpisodesTabWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Episodes</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

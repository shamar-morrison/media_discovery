import { Tabs } from "expo-router";
import { TabIcon } from "@/components/tab-icon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1D1D1D",
          position: "relative",
          minHeight: 60,
          shadowColor: "#000",
          shadowOpacity: 1,
          elevation: 10,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"home"} title={"Discover"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"search"} title={"Search"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(trending)"
        options={{
          title: "Trending",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={"trending-up"}
              title={"Trending"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"person"} title={"Profile"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

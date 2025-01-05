import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";

export const tabStyles: MaterialTopTabNavigationOptions = {
  tabBarScrollEnabled: false,
  tabBarIndicatorStyle: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  tabBarActiveTintColor: "rgba(255,255,255,0.85)",
  tabBarInactiveTintColor: "rgba(255,255,255,0.48)",
  tabBarStyle: { backgroundColor: "#242426" },
  sceneStyle: { backgroundColor: "#1d1d1d" },
};

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ListsTab } from "@/components/screens/lists-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";
import { ProgressTab } from "@/components/screens/progress-tab";
import React from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  return (
    <>
      <View className="p-4">
        <ScreenTitle>Profile</ScreenTitle>
      </View>
      <Tab.Navigator screenOptions={tabStyles} backBehavior={"none"}>
        <Tab.Screen
          name="lists"
          component={ListsTab}
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

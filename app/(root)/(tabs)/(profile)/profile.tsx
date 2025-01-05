import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedText } from "@/components/themed-text";
import { ListsTab } from "@/components/screens/lists-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  return (
    <Tab.Navigator screenOptions={tabStyles}>
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
        component={Foo}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Progress</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function Foo() {
  return (
    <View>
      <ThemedText>Profile</ThemedText>
    </View>
  );
}

export function Bar() {
  return (
    <View>
      <ThemedText>Bar</ThemedText>
    </View>
  );
}

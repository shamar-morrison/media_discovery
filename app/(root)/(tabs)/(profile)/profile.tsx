import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedText } from "@/components/themed-text";
import { Watchlists } from "@/components/screens/watchlists-screen";
import { TabBarLabel } from "@/components/tab-bar-label";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "rgba(255,255,255,0.85)",
        },
        tabBarActiveTintColor: "rgba(255,255,255,0.85)",
        tabBarInactiveTintColor: "rgba(255,255,255,0.48)",
        tabBarStyle: { backgroundColor: "#242426" },
        sceneStyle: { backgroundColor: "#1d1d1d" },
      }}
    >
      <Tab.Screen
        name="lists"
        component={() => <Watchlists />}
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

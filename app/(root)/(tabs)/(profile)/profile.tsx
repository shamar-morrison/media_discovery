import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ListsTab } from "@/components/screens/lists-tab";
import { TabBarLabel } from "@/components/tab-bar-label";
import { tabStyles } from "@/styles/tab-styles";
import { ProgressTab } from "@/components/screens/progress-tab";

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
        component={ProgressTab}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Progress</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import icons from "@/constants/icons";

function TabIcon({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) {
  return (
    <View className={"flex-1 mt-3 flex flex-col items-center"}>
      <Image
        className={"size-6"}
        source={icon}
        tintColor={focused ? "#0061FF" : "#FBFBFD"}
        resizeMode={"contain"}
      />
      <Text
        className={`${focused ? "text-primary-300 font-rubik-medium" : "text-accent-100 font-rubik"} text-sm w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1D1D1D",
          position: "relative",
          minHeight: 70,
          shadowColor: "#000",
          shadowOpacity: 0.9,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} title={"Home"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.search} title={"Explore"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} title={"Profile"} focused={focused} />
          ),
        }}
      />

      {/* Non Tabs Screens */}
      <Tabs.Screen
        name="(screens)/details/[id]"
        options={{
          headerShown: false,
          href: null, // this prevents the tab from showing up in the bottom tab bar
        }}
      />
    </Tabs>
  );
}

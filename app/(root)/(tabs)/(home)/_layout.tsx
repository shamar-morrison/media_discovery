import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function HomeLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#1d1d1d",
          },
          drawerLabelStyle: {
            color: "#fff",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Discover",
            drawerItemStyle: { display: "flex" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

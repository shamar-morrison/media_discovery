import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";

console.log("");

export default function RootLayout() {
  useEffect(() => {
    useWatchlistStore.getState().initialize();
    useWatchedEpisodesStore.getState().initialize();
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
  });

  const [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        className={"flex-1 h-full bg-black-200 items-center justify-center"}
      >
        <ActivityIndicator size={"large"} color={"#fff"} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView
        style={{ backgroundColor: "#1d1d1d", flex: 1, height: "100%" }}
      >
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: "#1d1d1d" }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#1d1d1d",
              },
              animation: "none",
              presentation: "card",
            }}
          />
        </View>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

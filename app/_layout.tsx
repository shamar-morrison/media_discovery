import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
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
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

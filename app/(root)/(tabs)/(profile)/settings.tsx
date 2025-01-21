import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSettingsStore } from "@/store/settings-store";
import { Stack } from "expo-router";

export default function SettingsScreen() {
  const resetTvShowRemovalPreference = useSettingsStore(
    (state) => state.resetTvShowRemovalPreference,
  );

  return (
    <View className="flex-1 bg-black-200">
      <Stack.Screen options={{ title: "Settings" }} />

      <View className="p-4">
        <View className="bg-black-100 rounded-lg p-4">
          <ThemedText className="text-lg font-inter-semibold mb-4">
            TV Show Preferences
          </ThemedText>

          <TouchableOpacity
            onPress={resetTvShowRemovalPreference}
            className="bg-gray-700 p-4 rounded-lg"
          >
            <ThemedText className="text-center">
              Reset TV Show Removal Preference
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

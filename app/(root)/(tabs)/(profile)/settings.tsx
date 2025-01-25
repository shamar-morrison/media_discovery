import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSettingsStore } from "@/store/settings-store";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsScreen() {
  const resetTvShowRemovalPreference = useSettingsStore(
    (state) => state.resetTvShowRemovalPreference,
  );

  return (
    <View className="flex-1 bg-black-200">
      <View className="p-4">
        <View className="bg-black-100 rounded-lg p-4">
          <ThemedText className="text-lg font-inter-semibold mb-4">
            TV Show Preferences
          </ThemedText>

          <TouchableOpacity onPress={resetTvShowRemovalPreference}>
            <View className="border border-gray-300/10 p-4 rounded-lg flex-row items-center gap-3">
              <Ionicons name={"refresh"} size={20} color={"#fff"} />
              <ThemedText>Reset TV Show Removal Preference</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

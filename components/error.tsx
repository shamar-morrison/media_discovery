import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/button";
import Ionicons from "@expo/vector-icons/Ionicons";

type ErrorProps = {
  onRetry: () => void;
  message?: string;
};

export function Error({
  onRetry,
  message = "There was an error. Please try again.",
}: ErrorProps) {
  return (
    <View className="bg-black-200 h-full px-4">
      <View className="flex flex-1 items-center gap-5 justify-center">
        <ThemedText className={"font-inter-medium text-xl text-center"}>
          {message}
        </ThemedText>
        <Button onPress={onRetry} className={""}>
          <Ionicons name={"refresh"} size={20} color={"#fff"} />
          <ThemedText>Retry</ThemedText>
        </Button>
      </View>
    </View>
  );
}

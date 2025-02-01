import {
  cancelShowReminders,
  getShowReminders,
  requestNotificationsPermissions,
  scheduleEpisodeReminder,
  scheduleSeasonReminder,
} from "@/lib/notifications";
import { useHandleSheetChanges } from "@/utils/handle-sheet-changes";
import { showToast } from "@/utils/toast";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Sheet, useSheetRef } from "./nativewindui/Sheet";
import { ThemedText } from "./themed-text";

type ReminderType = "episode" | "season";

type ReminderButtonProps = {
  showId: number;
  showName: string;
  nextEpisode?: {
    episodeNumber: number;
    seasonNumber: number;
    airDate: string;
  };
  nextSeason?: {
    seasonNumber: number;
    airDate: string;
  };
};

export function ReminderButton({
  showId,
  showName,
  nextEpisode,
  nextSeason,
}: ReminderButtonProps) {
  const [hasReminders, setHasReminders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ReminderType | null>(null);
  const sheetRef = useSheetRef();
  const handleSheetChanges = useHandleSheetChanges();

  const checkExistingReminders = useCallback(async () => {
    const reminders = await getShowReminders(showId);
    setHasReminders(reminders.length > 0);
  }, [showId]);

  useEffect(() => {
    checkExistingReminders();
  }, [checkExistingReminders]);

  const handleSetReminders = useCallback(async () => {
    if (!selectedType) {
      showToast("Please select a reminder type");
      return;
    }

    setIsLoading(true);
    try {
      const hasPermission = await requestNotificationsPermissions();
      if (!hasPermission) {
        showToast("Notification permissions are required for reminders");
        return;
      }

      // Cancel any existing reminders first
      await cancelShowReminders(showId);

      if (selectedType === "episode" && nextEpisode?.airDate) {
        await scheduleEpisodeReminder(
          showId,
          showName,
          nextEpisode.episodeNumber,
          nextEpisode.seasonNumber,
          nextEpisode.airDate,
        );
      } else if (selectedType === "season" && nextSeason?.airDate) {
        await scheduleSeasonReminder(
          showId,
          showName,
          nextSeason.seasonNumber,
          nextSeason.airDate,
        );
      }

      await checkExistingReminders();
      showToast("Reminder set successfully");
      sheetRef.current?.close();
    } catch (error) {
      console.error("Error setting reminder:", error);
      showToast("Failed to set reminder");
    } finally {
      setIsLoading(false);
    }
  }, [
    showId,
    showName,
    nextEpisode,
    nextSeason,
    selectedType,
    checkExistingReminders,
  ]);

  const handleCancelReminders = useCallback(async () => {
    setIsLoading(true);
    try {
      await cancelShowReminders(showId);
      await checkExistingReminders();
      setSelectedType(null);
      showToast("Reminders cancelled");
      sheetRef.current?.close();
    } catch (error) {
      console.error("Error cancelling reminders:", error);
      showToast("Failed to cancel reminders");
    } finally {
      setIsLoading(false);
    }
  }, [showId, checkExistingReminders]);

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const RadioOption = ({
    type,
    label,
    disabled,
  }: {
    type: ReminderType;
    label: string;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={() => !disabled && setSelectedType(type)}
      className={`flex-row items-center p-4 rounded-lg ${
        disabled ? "opacity-50" : "bg-black-100"
      }`}
      disabled={disabled}
    >
      <View
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          selectedType === type ? "border-primary-300" : "border-accent-100"
        }`}
      >
        {selectedType === type && (
          <View className="w-3 h-3 rounded-full bg-primary-300" />
        )}
      </View>
      <ThemedText className="flex-1">{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        onPress={openSheet}
        className="flex-row items-center bg-black-100 rounded-lg px-4 py-2"
      >
        <MaterialIcons
          name={hasReminders ? "notifications-active" : "notifications-none"}
          size={24}
          color={hasReminders ? "#0061FF" : "#FBFBFD"}
        />
        <ThemedText className="ml-2">
          {hasReminders ? "Manage Reminders" : "Set Reminders"}
        </ThemedText>
      </TouchableOpacity>

      <Sheet ref={sheetRef} onChange={handleSheetChanges}>
        <BottomSheetView className="p-4">
          <ThemedText className="text-xl font-inter-semibold mb-4">
            Reminder Settings
          </ThemedText>

          <View className="space-y-3">
            <RadioOption
              type="episode"
              label="Remind me 1 day before new episodes"
              disabled={!nextEpisode}
            />
            <RadioOption
              type="season"
              label="Remind me 1 week before new seasons"
              disabled={!nextSeason}
            />

            <View className="space-y-2 mt-4">
              <TouchableOpacity
                onPress={handleSetReminders}
                disabled={isLoading || !selectedType}
                className={`bg-primary-300 p-4 rounded-lg ${
                  isLoading || !selectedType ? "opacity-50" : ""
                }`}
              >
                <ThemedText className="text-center font-inter-medium">
                  {isLoading ? "Setting Reminder..." : "Set Reminder"}
                </ThemedText>
              </TouchableOpacity>

              {hasReminders && (
                <TouchableOpacity
                  onPress={handleCancelReminders}
                  disabled={isLoading}
                  className={`bg-red-500 p-4 rounded-lg ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  <ThemedText className="text-center font-inter-medium">
                    {isLoading ? "Cancelling..." : "Cancel Reminder"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BottomSheetView>
      </Sheet>
    </>
  );
}

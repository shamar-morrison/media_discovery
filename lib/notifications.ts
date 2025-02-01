import { format } from "date-fns";
import type { NotificationTriggerInput } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export async function requestNotificationsPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0061FF",
    });
  }

  return true;
}

// Schedule episode reminder
export async function scheduleEpisodeReminder(
  showId: number,
  showName: string,
  episodeNumber: number,
  seasonNumber: number,
  airDate: string,
) {
  const episodeAirDate = new Date(airDate);
  const notificationDate = new Date(airDate);
  notificationDate.setDate(notificationDate.getDate() - 1); // 1 day before

  const trigger: NotificationTriggerInput = {
    channelId: "default",
    date: notificationDate,
  };

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `New Episode Tomorrow: ${showName}`,
      body: `Episode ${episodeNumber} of Season ${seasonNumber} airs on ${format(episodeAirDate, "EEEE, MMMM do 'at' h:mm a")}`,
      data: { showId, episodeNumber, seasonNumber },
    },
    trigger,
  });
}

// Schedule season reminder
export async function scheduleSeasonReminder(
  showId: number,
  showName: string,
  seasonNumber: number,
  airDate: string,
) {
  const seasonAirDate = new Date(airDate);
  const notificationDate = new Date(airDate);
  notificationDate.setDate(notificationDate.getDate() - 7); // 1 week before

  const trigger: NotificationTriggerInput = {
    channelId: "default",
    date: notificationDate,
  };

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `New Season Coming Soon: ${showName}`,
      body: `Season ${seasonNumber} premieres on ${format(seasonAirDate, "EEEE, MMMM do 'at' h:mm a")}`,
      data: { showId, seasonNumber },
    },
    trigger,
  });
}

// Cancel all reminders for a show
export async function cancelShowReminders(showId: number) {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    if (notification.content.data?.showId === showId) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}

// Get all scheduled reminders for a show
export async function getShowReminders(showId: number) {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();
  return scheduledNotifications.filter(
    (notification) => notification.content.data?.showId === showId,
  );
}

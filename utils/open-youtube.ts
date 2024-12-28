import * as Linking from "expo-linking";

export async function openYoutube(videoId: string) {
  // Try opening in YouTube app first
  const youtubeUrl = `youtube://www.youtube.com/watch?v=${videoId}`;
  const canOpenYoutube = await Linking.canOpenURL(youtubeUrl);

  if (canOpenYoutube) {
    await Linking.openURL(youtubeUrl);
  } else {
    // Fallback to browser if YouTube app is not installed
    await Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  }
}

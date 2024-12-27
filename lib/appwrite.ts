import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.horizon.rn_real_estate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/", {});
    const token = account.createOAuth2Token(OAuthProvider.Google, redirectUri);

    if (!token) {
      throw new Error("Failed to create OAuth2 token");
    }

    const browserResult = await openAuthSessionAsync(
      token.toString(),
      redirectUri,
    );

    if (browserResult.type !== "success") {
      throw new Error("Failed to open auth session");
    }

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("Failed to get secret and userId from URL");
    }

    const session = await account.createSession(userId, secret);

    if (!session) {
      throw new Error("Failed to create session");
    }

    return session;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUser() {
  try {
    const session = await account.getSession("current");

    if (!session) {
      throw new Error("Failed to get session");
    }

    const user = await account.get();

    if (user.$id) {
      const avatarImg = avatar.getInitials(user.name);
      return {
        ...user,
        avatar: avatarImg.toString(),
      };
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

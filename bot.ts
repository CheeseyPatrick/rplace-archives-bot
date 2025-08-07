import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Snowflake,
} from "discord.js";
import { spammedChannelID } from "./constants";
import { rm } from "fs/promises";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  client.user.setActivity("rplace.live", { type: ActivityType.Watching });
});

client.login(process.env.TOKEN).then((_) => {});

export function time(date: Date) {
  return date.toLocaleString("en-US", {
    // "8/6/2025, 10:02 PM"
    timeZone: "America/New_York",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function timestamp(date: Date) {
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return `<t:${unixTimestamp}>`;
}

export async function sendVideo(
  videoPath: string,
  channelID: Snowflake = spammedChannelID
) {
  const now = new Date();
  const content = `${time(now)}\n${timestamp(now)}`;

  const channel = await client.channels.fetch(channelID);
  if (channel && channel.isSendable()) {
    try {
      await channel.send({
        content,
        files: [videoPath],
        flags: MessageFlags.SuppressNotifications,
      });

      return true;
    } catch (err) {
      console.error(`Failed to send message ${time(now)}: ${err}`);
      return false;
    }
  }
  return false;
}

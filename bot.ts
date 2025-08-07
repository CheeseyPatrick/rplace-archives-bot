import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Snowflake,
} from "discord.js";
import { spammedChannelID } from "./constants";
import { time, timestamp } from "./utils";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  client.user.setActivity("rplace.live", { type: ActivityType.Watching });
});

client.login(process.env.TOKEN);

export async function sendVideo(
  videoPath: string,
  date: Date = new Date(),
  channelID: Snowflake = spammedChannelID
) {
  const content = `${time(date)}\n${timestamp(date)}`;

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
      console.error(`Failed to send message ${time(date)}: ${err}`);
      return false;
    }
  }
  return false;
}

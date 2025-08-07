import cron from "node-cron";
import { sixtySecondTimelapse } from "./timelapse";
import { sendVideo, client } from "./bot";
import { Events } from "discord.js";
import { promises as fs } from "fs";
import { glob } from "glob";
import { promisify } from "util";

async function cleanDirectories() {
  const patterns = ["./frames/**", "./videos/**"];
  const globPromise = promisify(glob);

  const allFileLists = await Promise.all(
    patterns.map((pattern) => globPromise(pattern, { dot: false, nodir: true }))
  );
  const allFiles = allFileLists.flat() as string[];

  await Promise.all(allFiles.map((file) => fs.unlink(file)));
}

async function main() {
  await cleanDirectories();

  cron.schedule("0 * * * * *", async () => {
    // runs at 0 seconds of every minute
    if (!client.isReady()) {
      await new Promise<void>((resolve) => {
        // 🤮
        client.once(Events.ClientReady, () => resolve());
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1));
    const now = new Date();

    const videoPath = await sixtySecondTimelapse();
    if (!videoPath) return;

    await sendVideo(videoPath, now);
  });
}

main();

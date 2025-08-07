import "./bot";
import { Events } from "discord.js";
import { promises as fs } from "fs";
import { glob } from "glob";
import { promisify } from "util";
import { config } from "dotenv";

config();

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
}

main();

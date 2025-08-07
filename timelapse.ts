import { getBoard, renderBoard } from "./board";
import { promises as fs } from "fs";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { exec } from "child_process";
import { promisify } from "util";
import { glob } from "glob";

async function captureAndSave(filePath: string) {
  try {
    const board = await getBoard();
    const image = await renderBoard(board);

    await fs.writeFile(filePath, image);
    return true;
  } catch (err) {
    console.error("Error while saving image: ", err);
    return false;
  }
}

async function deleteFrames(currentMinute: number) {
  const pattern = `./frames/frame_${currentMinute}_*.png`;
  const files = await glob(pattern);
  await Promise.all(files.map((file) => fs.unlink(file)));
}

export async function sixtySecondTimelapse() {
  const now = new Date();
  const currentMinute = now.getMinutes();

  let files = [] as string[];

  for (let i = 0; i < 60; i++) {
    const frameNumber = String(i + 1).padStart(6, "0");
    const filename = `./frames/frame_${currentMinute}_${frameNumber}.png`;

    captureAndSave(filename);
    files.push(filename);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));
  const execPromise = promisify(exec);
  const outputPath = `./videos/video_${currentMinute}.mp4`;

  try {
    console.log("Processing video ", currentMinute);
    const { stdout, stderr } = await execPromise(
      `${ffmpegPath.path} -y -framerate 1 -start_number 1 -i ./frames/frame_${currentMinute}_%06d.png -frames:v 60 -c:v libx264 -pix_fmt yuv444p -crf 15 ${outputPath}`
    );

    console.log("ffmpeg stdout: ", stdout);
    if (stderr) {
      console.error("ffmpeg stderr: ", stderr);
    }

    deleteFrames(currentMinute);
    return outputPath;
  } catch (err) {
    console.error(`Error processing video ${currentMinute}: `, err);
    return null;
  }
}

// test script
console.log("Starting 60 second timelapse...");
const path = await sixtySecondTimelapse();
console.log("Timelapse saved to ", path);

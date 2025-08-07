import { createCanvas } from "canvas";
import { RPLACE_PALETTE } from "./constants";
import { writeFile } from "fs/promises";

export async function getBoard() {
  const resp = await fetch("https://server.rplace.live/public/place");
  const arrayBuffer = await resp.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function renderBoard(board: Uint8Array) {
  const width = Math.sqrt(board.length) || 1000;
  const height = Math.sqrt(board.length) || 1000;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < board.length; i++) {
    const color = RPLACE_PALETTE[board[i]];
    const j = i * 4;

    data[j] = color.r;
    data[j + 1] = color.g;
    data[j + 2] = color.b;
    data[j + 3] = color.a;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer();
}

// test script
const board = await getBoard();
const image = await renderBoard(board);
await writeFile("./canvas.png", image);

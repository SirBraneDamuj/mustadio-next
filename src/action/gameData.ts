"use server";

import { container } from "../app";

export default async function getGameData(force: boolean = false) {
  const fftbgGameData = container.resolve("fftbgGameData");
  if (force) {
    return await fftbgGameData.forceGet();
  }
  return await fftbgGameData.get();
}

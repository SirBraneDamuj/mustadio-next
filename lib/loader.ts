import { promises as fs } from "fs";

type GameDataLoaderStrategy = "fake" | "real";

export type GameDataLoader = (filename: string) => Promise<string>;

const fakeGameDataLoader: GameDataLoader = (filename: string) => {
  console.log(`Loading fake game data from: ${filename}`);
  const filePath = `./resources/fftbg_fake/${filename}`;
  return fs.readFile(filePath, "utf-8");
};

const realGameDataLoader = (baseUrl: string) => async (filename: string) => {
  const url = `${baseUrl}${filename}`;
  console.log(`Loading real game data from: ${url}`);
  const data = await fetch(url);
  if (data.status === 404) {
    return "404";
  }
  return data.text();
};

export function getGameDataLoader({
  fftbgLoaderStrategy,
  fftbgBaseUrl,
}: {
  fftbgLoaderStrategy: GameDataLoaderStrategy;
  fftbgBaseUrl: string;
}): GameDataLoader {
  if (fftbgLoaderStrategy === "real") {
    return realGameDataLoader(fftbgBaseUrl);
  } else {
    return fakeGameDataLoader;
  }
}

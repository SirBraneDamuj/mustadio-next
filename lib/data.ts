"use server";

import { promises as fs } from "fs";
import { parseAbilities } from "./abilities/abilities-parser";
import { parseClassHelp } from "./classes/classes-parser";
import { parseItemsDump } from "./items/items-parser";
import { parseMonsters } from "./monsters/monsters-parser";
import { parseStatuses } from "./statuses/statuses-parser";
import {
  Items,
  MonsterSkills,
  Statuses,
  UnitAbilities,
  UnitClasses,
  Zodiacs,
} from "./types";
import { parseZodiacs } from "./zodiac/zodiac-parser";

type GameDataLoader = (filename: string) => Promise<string>;

const fakeGameDataLoader: GameDataLoader = (filename: string) => {
  console.log(`Loading fake game data from: ${filename}`);
  const filePath = `./resources/fftbg_fake/${filename}`;
  return fs.readFile(filePath, "utf-8");
};

const realGameDataLoader: GameDataLoader = (filename: string) => {
  console.log(`Loading real game data from: ${filename}`);
  const baseUrl = process.env.FFTBG_BASE_URL;
  if (!baseUrl) {
    throw new Error("FFTBG_BASE_URL is not defined");
  }
  const filePath = `./resources/fftbg/${filename}`;
  return fs.readFile(filePath, "utf-8");
};

const gameDataLoader: GameDataLoader =
  process.env.FFTBG_STRATEGY === "real"
    ? realGameDataLoader
    : fakeGameDataLoader;

type GameData = {
  monsterSkills: MonsterSkills;
  classes: UnitClasses;
  abilities: UnitAbilities;
  items: Items;
  statuses: Statuses;
  zodiacs: Zodiacs;
};

let gameData: Promise<GameData | null> = Promise.resolve(null);

export async function getGameData(force: boolean = false): Promise<GameData> {
  const it = await gameData;
  if (force || !it) {
    const newGameData = refreshGameData();
    gameData = newGameData;
    return newGameData;
  }
  return it;
}

export async function refreshGameData(): Promise<GameData> {
  console.log("Refreshing game data...");
  const [
    monstersDump,
    monsterSkillsDump,
    classesDump,
    abilitiesDump,
    itemsDump,
    statusesDump,
    zodiacsDump,
  ] = ([] = await Promise.all([
    gameDataLoader("Monsters.txt"),
    gameDataLoader("MonsterSkills.txt"),
    gameDataLoader("classhelp.txt"),
    gameDataLoader("infoability.txt"),
    gameDataLoader("infoitem.txt"),
    gameDataLoader("infostatus.txt"),
    gameDataLoader("zodiachelp.txt"),
  ]));

  return {
    monsterSkills: parseMonsters(monstersDump, monsterSkillsDump),
    classes: parseClassHelp(classesDump),
    abilities: parseAbilities(abilitiesDump),
    items: parseItemsDump(itemsDump),
    statuses: parseStatuses(statusesDump),
    zodiacs: parseZodiacs(zodiacsDump),
  };
}

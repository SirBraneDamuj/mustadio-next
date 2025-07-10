import { parseAbilities } from "./abilities/abilities-parser";
import { cache, CachedFunction } from "./cache";
import { parseClassHelp } from "./classes/classes-parser";
import { parseItemsDump } from "./items/items-parser";
import { GameDataLoader } from "./loader";
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

export type GameData = {
  monsterSkills: MonsterSkills;
  classes: UnitClasses;
  abilities: UnitAbilities;
  items: Items;
  statuses: Statuses;
  zodiacs: Zodiacs;
};

export function getGameData({
  fftbgGameDataLoader,
}: {
  fftbgGameDataLoader: GameDataLoader;
}): CachedFunction<GameData> {
  console.log("Refreshing game data...");
  return cache(async () => {
    const [
      monstersDump,
      monsterSkillsDump,
      classesDump,
      abilitiesDump,
      itemsDump,
      statusesDump,
      zodiacsDump,
    ] = ([] = await Promise.all([
      fftbgGameDataLoader("Monsters.txt"),
      fftbgGameDataLoader("MonsterSkills.txt"),
      fftbgGameDataLoader("classhelp.txt"),
      fftbgGameDataLoader("infoability.txt"),
      fftbgGameDataLoader("infoitem.txt"),
      fftbgGameDataLoader("infostatus.txt"),
      fftbgGameDataLoader("zodiachelp.txt"),
    ]));

    return {
      monsterSkills: parseMonsters(monstersDump, monsterSkillsDump),
      classes: parseClassHelp(classesDump),
      abilities: parseAbilities(abilitiesDump),
      items: parseItemsDump(itemsDump),
      statuses: parseStatuses(statusesDump),
      zodiacs: parseZodiacs(zodiacsDump),
    };
  }, 60_000);
}

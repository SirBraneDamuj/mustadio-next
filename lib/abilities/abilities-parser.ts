import { AbilityTypeSchema, UnitAbilities, UnitAbility } from "../types";

const abilityTypesFromFile = ["Reaction", "Support", "Movement"] as const;
const fileAbilityTypeMapping = {
  Reaction: "react",
  Support: "support",
  Movement: "move",
};

export const activesByClassName = {
  Squire: "Basic Skill",
  Chemist: "Item",
  Knight: "Battle Skill",
  Archer: "Charge",
  Monk: "Punch Art",
  Priest: "White Magic",
  Wizard: "Black Magic",
  TimeMage: "Time Magic",
  "Time Mage": "Time Magic",
  Summoner: "Summon Magic",
  Thief: "Steal",
  Mediator: "Talk Skill",
  Oracle: "Yin Yang Magic",
  Geomancer: "Elemental",
  Lancer: "Jump",
  Samurai: "Draw Out",
  Ninja: "Throw",
  Calculator: "Math Skill",
  Bard: "Sing",
  Mime: "Mimic",
  Dancer: "Dance",
};

function parseAbilityLine(abilityLine: string): UnitAbility {
  const firstColon = abilityLine.indexOf(":");
  const name = abilityLine.slice(0, firstColon);
  const info = abilityLine.slice(firstColon + 2);
  const abilityType = abilityTypesFromFile.find((type) =>
    info.startsWith(`${type}. `)
  );
  const realAbilityType = abilityType
    ? AbilityTypeSchema.parse(fileAbilityTypeMapping[abilityType])
    : "active";
  return {
    name,
    info,
    type: realAbilityType,
  };
}

export function parseAbilities(abilitiesHelp: string): UnitAbilities {
  console.log("parsing abilities");
  const lines = abilitiesHelp.split(/\r?\n/).filter(Boolean);
  const abilities: UnitAbilities = {};

  for (const line of lines) {
    const ability = parseAbilityLine(line);
    abilities[ability.name] = ability;
  }

  return abilities;
}

import { z } from "zod";

export const EQUIPMENT_SLOTS = ["hand", "head", "body", "accessory"] as const;
export const EquipmentSlotSchema = z.enum(EQUIPMENT_SLOTS);
export type EquipmentSlot = z.infer<typeof EquipmentSlotSchema>;

export const EQUIPMENT_TYPES_FOR_SLOT = {
  hand: [
    "Knife",
    "Ninja Blade",
    "Sword",
    "Knight Sword",
    "Katana",
    "Axe",
    "Rod",
    "Staff",
    "Flail",
    "Gun",
    "Crossbow",
    "Bow",
    "Harp",
    "Book",
    "Spear",
    "Pole",
    "Bag",
    "Fabric",
    "Shield",
  ],
  head: ["Helmet", "Hat"],
  body: ["Armor", "Clothes", "Clothing", "Robe"],
  accessory: ["Accessory"],
} as const;

export const EQUIPMENT_TYPES = [
  "Knife",
  "Ninja Blade",
  "Sword",
  "Knight Sword",
  "Katana",
  "Axe",
  "Rod",
  "Staff",
  "Flail",
  "Gun",
  "Crossbow",
  "Bow",
  "Harp",
  "Book",
  "Spear",
  "Pole",
  "Bag",
  "Fabric",
  "Shield",
  "Helmet",
  "Hat",
  "Armor",
  "Clothes",
  "Clothing",
  "Robe",
  "Accessory",
] as const;

export const EquipmentTypeSchema = z.enum(EQUIPMENT_TYPES);
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export type EquipmentSlotTypePair =
  | { slot: "hand"; type: (typeof EQUIPMENT_TYPES_FOR_SLOT)["hand"][number] }
  | { slot: "head"; type: (typeof EQUIPMENT_TYPES_FOR_SLOT)["head"][number] }
  | { slot: "body"; type: (typeof EQUIPMENT_TYPES_FOR_SLOT)["body"][number] }
  | {
      slot: "accessory";
      type: (typeof EQUIPMENT_TYPES_FOR_SLOT)["accessory"][number];
    };

export const SLOTS_FOR_EQUIPMENT_TYPES: Record<EquipmentType, EquipmentSlot> =
  EQUIPMENT_SLOTS.reduce(
    (accumulator, slot) => {
      EQUIPMENT_TYPES_FOR_SLOT[slot].forEach((type) => {
        accumulator[type] = slot;
      });
      return accumulator;
    },
    {} as Record<EquipmentType, EquipmentSlot>
  );

export const GENDERS = ["Male", "Female", "Monster"] as const;
export const GenderSchema = z.enum(GENDERS);
export type Gender = z.infer<typeof GenderSchema>;

export const TEAM_NAMES = [
  "red",
  "blue",
  "green",
  "yellow",
  "white",
  "black",
  "purple",
  "brown",
  "champion",
] as const;
export const TeamNameSchema = z.enum(TEAM_NAMES);
export type TeamName = z.infer<typeof TeamNameSchema>;

export const MATCHUPS: [TeamName, TeamName][][] = [
  // ROUND 1
  [[TEAM_NAMES[0], TEAM_NAMES[1]]],
  [[TEAM_NAMES[2], TEAM_NAMES[3]]],
  [[TEAM_NAMES[4], TEAM_NAMES[5]]],
  [[TEAM_NAMES[6], TEAM_NAMES[7]]],
  // ROUND 2
  [
    [TEAM_NAMES[0], TEAM_NAMES[2]],
    [TEAM_NAMES[0], TEAM_NAMES[3]],
    [TEAM_NAMES[1], TEAM_NAMES[2]],
    [TEAM_NAMES[1], TEAM_NAMES[3]],
  ],
  [
    [TEAM_NAMES[4], TEAM_NAMES[6]],
    [TEAM_NAMES[4], TEAM_NAMES[7]],
    [TEAM_NAMES[5], TEAM_NAMES[6]],
    [TEAM_NAMES[5], TEAM_NAMES[7]],
  ],
  // ROUND 3
  [
    [TEAM_NAMES[0], TEAM_NAMES[4]],
    [TEAM_NAMES[0], TEAM_NAMES[5]],
    [TEAM_NAMES[0], TEAM_NAMES[6]],
    [TEAM_NAMES[0], TEAM_NAMES[7]],
    [TEAM_NAMES[1], TEAM_NAMES[4]],
    [TEAM_NAMES[1], TEAM_NAMES[5]],
    [TEAM_NAMES[1], TEAM_NAMES[6]],
    [TEAM_NAMES[1], TEAM_NAMES[7]],
    [TEAM_NAMES[2], TEAM_NAMES[4]],
    [TEAM_NAMES[2], TEAM_NAMES[5]],
    [TEAM_NAMES[2], TEAM_NAMES[6]],
    [TEAM_NAMES[2], TEAM_NAMES[7]],
    [TEAM_NAMES[3], TEAM_NAMES[4]],
    [TEAM_NAMES[3], TEAM_NAMES[5]],
    [TEAM_NAMES[3], TEAM_NAMES[6]],
    [TEAM_NAMES[3], TEAM_NAMES[7]],
  ],
  // ROUND 4
  [
    [TEAM_NAMES[0], TEAM_NAMES[8]],
    [TEAM_NAMES[1], TEAM_NAMES[8]],
    [TEAM_NAMES[2], TEAM_NAMES[8]],
    [TEAM_NAMES[3], TEAM_NAMES[8]],
    [TEAM_NAMES[4], TEAM_NAMES[8]],
    [TEAM_NAMES[5], TEAM_NAMES[8]],
    [TEAM_NAMES[6], TEAM_NAMES[8]],
    [TEAM_NAMES[7], TEAM_NAMES[8]],
  ],
];

export function matchNumberForMatchup(
  team1: TeamName,
  team2: TeamName
): number {
  return MATCHUPS.findIndex((match) =>
    match.some(([t1, t2]) => t1 === team1 && t2 === team2)
  );
}

export const actives = {
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

export const ABILITY_TYPES = ["active", "react", "support", "move"] as const;
export const AbilityTypeSchema = z.enum(ABILITY_TYPES);
export type AbilityType = z.infer<typeof AbilityTypeSchema>;

// Tournament model
export type Tournament = {
  id: string;
  teams: Team[];
  maps: TournamentMap[];
  winners: TournamentWinner[];
};

// Team model
export type Team = {
  name: TeamName;
  units: Unit[];
};

// TournamentMap model
export type TournamentMap = {
  number: string;
  title: string;
  order: number;
};

// TournamentWinner model
export type TournamentWinner = {
  name: string;
  matchNum: number;
};

// Unit model
export type Unit = {
  name: string;
  gender: string;
  zodiac: string;
  brave: string;
  faith: string;
  class: string;
  subSkill: string | null;
  reactSkill: string | null;
  supportSkill: string | null;
  moveSkill: string | null;
  order: number;
  teamName: TeamName;
  mainAbilities: string[];
  subAbilities: string[];
  equipment: string[];
  raw: string;
};

// UnitAbility model
export type UnitAbility = {
  name: string;
  type: AbilityType;
  info: string;
};

// UnitEquipment model
export type UnitEquipment = {
  name: string;
  slot: EquipmentSlot;
  type: EquipmentType;
};

export type GenderlessClass = {
  name: string;
  baseStats: {
    hp: number;
    mp: number;
    move: number;
    jump: number;
    speed: number;
    pa: number;
    ma: number;
    cEvPercent: number;
  };
  innates: string[];
  raw: string;
};

export type MaleClass = GenderlessClass & {
  gender: "Male";
};

export type FemaleClass = GenderlessClass & {
  gender: "Female";
};

export type MonsterClass = GenderlessClass & {
  gender: "Monster";
};

export type GenderedClass = MaleClass | FemaleClass | MonsterClass;

export type HumanGenderedClass = {
  Male?: MaleClass;
  Female?: FemaleClass;
};

export type MonsterGenderedClass = {
  Monster: MonsterClass;
};

export type UnitClass = HumanGenderedClass | MonsterGenderedClass;

export type MonsterSkills = {
  [monsterName: string]: {
    name: string;
    skills: string[];
  };
};

export type Statuses = {
  [statusName: string]: {
    name: string;
    info: string;
  };
};

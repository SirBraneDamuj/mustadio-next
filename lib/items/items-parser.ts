import {
  EquipmentTypeSchema,
  Item,
  Items,
  SLOTS_FOR_EQUIPMENT_TYPES,
} from "../types";
import { toNumber } from "../util";

const theBigRegex =
  /^(?<itemName>[A-Z\d][\w\d \-']+): (?:(?<wp>\d+) WP, )?(?:(?<healWp>\d+) WP \(heal(?:ing)?\), )?(?:(?<absorbWp>\d+) WP \(absorb(?:ing)?\), )?(?:(?<range>\d+) (?:range|range \(\w+\)), )?(?:(?<evadePercent>\d+%?) evade, )?(?:(?<physEvadePercent>\d+%) physical evade, )?(?:(?<magicEvadePercent>\d+%) magic evade, )?(?:\+(?<hp>\d+) HP, )?(?:\+(?<mp>\d+) MP, )?(?:(?<itemType>[A-Z][\w -]+(?: \((?:\w|\s)+\))?). ?)(?:Element: (?<element>[A-Z]\w+)\. ?)?(?:Effect: (?<effect>.*))?$/;
const statsRegex =
  /[^+]*(?:(?<pa>\+\d+) PA(?:, |\.|;))?(?:(?<ma>\+\d+) MA(?:, |\.|;))?(?:(?<speed>\+\d+) Speed(?:, |\.|;))?(?:(?<move>\+\d+) Move(?:, |\.|;))?(?:(?<jump>\+\d+) Jump(?:, |\.|;))?/;
const initialStatusRegex = /Initial (?<initialStatuses>[A-Z][^;.]+)(?:; |\.)/;
const permanentStatusRegex =
  /(?:Permanent|Always) (?<permStatuses>[A-Z][^;.]+)(?:; |\.)/;

const getInitialStatuses = (effect: string) => {
  const match = initialStatusRegex.exec(effect);
  if (match && match.groups && match.groups.initialStatuses) {
    return match.groups.initialStatuses.split(", ");
  }
  return [];
};

const getPermStatuses = (effect: string) => {
  const match = permanentStatusRegex.exec(effect);
  if (match && match.groups && match.groups.permStatuses) {
    return match.groups.permStatuses.split(", ");
  }
  return [];
};

function parseDumpLine(itemLine: string): Item | undefined {
  const regexMatch = theBigRegex.exec(itemLine);
  if (!regexMatch) {
    return undefined;
  }
  if (!regexMatch.groups) {
    return undefined;
  }
  const {
    itemName,
    wp,
    healWp,
    absorbWp,
    range,
    evadePercent,
    physEvadePercent,
    magicEvadePercent,
    hp,
    mp,
    itemType,
    element,
    effect,
  } = regexMatch.groups;
  if (
    itemType === "Shuriken" ||
    itemType === "Bomb" ||
    itemType === "Consumable"
  ) {
    return undefined;
  }
  const statsMatch = statsRegex.exec(effect);
  const { speed, move, jump, pa, ma } = statsMatch?.groups ?? {};
  const equipmentType = EquipmentTypeSchema.safeParse(
    itemType.split("(")[0].trim()
  );
  if (!equipmentType.success) {
    console.warn(
      `Invalid equipment type "${itemType}" in item line: ${itemLine}`
    );
    return undefined;
  }
  const slot = SLOTS_FOR_EQUIPMENT_TYPES[equipmentType.data];
  const firstColon = itemLine.indexOf(":");
  const info = itemLine.slice(firstColon + 2);
  return {
    name: itemName,
    type: equipmentType.data,
    slot,
    info,
    stats: {
      wp: toNumber(wp),
      healWp: toNumber(healWp),
      absorbWp: toNumber(absorbWp),
      range: toNumber(range),
      evadePercent: toNumber(evadePercent),
      physEvadePercent: toNumber(physEvadePercent),
      magicEvadePercent: toNumber(magicEvadePercent),
      hp: toNumber(hp),
      mp: toNumber(mp),
      element,
      speed: toNumber(speed),
      move: toNumber(move),
      jump: toNumber(jump),
      pa: toNumber(pa),
      ma: toNumber(ma),
      initialStatuses: getInitialStatuses(effect),
      permStatuses: getPermStatuses(effect),
    },
  };
}

export function parseItemsDump(dump: string): Items {
  const lines = dump.split("\n").map((line) => line.trim());
  const items: Items = {};
  for (const line of lines) {
    const item = parseDumpLine(line);
    if (item) {
      items[item.name] = item;
    }
  }
  return items;
}

import { GenderSchema, TeamName, Unit } from "../types";

function unitForTokens(tokens: string[]): Omit<Unit, "teamName" | "order"> {
  const unitTokens = [...tokens];
  const gender = unitTokens[1];
  const monster = gender === "Monster";
  const clazz = unitTokens[5];
  const mime = clazz === "Mime";
  if (mime) {
    unitTokens.splice(6, 0, "");
    unitTokens.push("");
  }
  const mainAbilities = unitTokens[unitTokens.length - 2].split(", ");
  const subAbilities = unitTokens[unitTokens.length - 1].split(", ");
  const equipment = unitTokens
    .slice(10, unitTokens.length - 2)
    .filter((s) => s !== "");
  return {
    name: unitTokens[0],
    gender: unitTokens[1],
    zodiac: unitTokens[2],
    brave: unitTokens[3],
    faith: unitTokens[4],
    class: unitTokens[5],
    subSkill: unitTokens[6],
    reactSkill: unitTokens[7],
    supportSkill: unitTokens[8],
    moveSkill: unitTokens[9],
    mainAbilities: !monster
      ? mainAbilities.map((abilityName) => ({
          name: abilityName,
        }))
      : [],
    subAbilities:
      !monster && !mime
        ? subAbilities.map((abilityName) => ({
            name: abilityName,
          }))
        : [],
    equipment: equipment.map((equipName) => ({
      name: equipName,
      slot: "head", // TODO: actually get these
      type: "Helmet", // TODO: actually get these
    })),
    raw: unitTokens.join(" - "),
  };
}

export function loadTeamFromString(
  teamName: TeamName,
  teamData: string
): Unit[] {
  let delimiter = "\r\n";
  if (teamData.indexOf(delimiter) == -1) {
    delimiter = "\n";
  }
  const tokens = teamData
    .split(delimiter)
    .slice(3)
    .filter((s) => s !== "");
  let index = 0;
  let lastUnitIndex = -1;
  const unitStrings = [];
  while (unitStrings.length < 4 && index < tokens.length) {
    const thisToken = tokens[index];
    const maybeGender = GenderSchema.safeParse(thisToken);
    if (maybeGender.success) {
      if (lastUnitIndex != -1) {
        unitStrings.push(tokens.slice(lastUnitIndex, index - 1));
      }
      lastUnitIndex = index - 1;
    }
    index += 1;
  }
  unitStrings.push(tokens.slice(lastUnitIndex));
  if (unitStrings.length != 4) {
    throw new Error(`found unexpected number (${unitStrings.length}) of units`);
  }

  const units = unitStrings.map((tokens, idx) => ({
    ...unitForTokens(tokens),
    teamName,
    order: idx,
  }));
  return units;
}

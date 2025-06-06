import { GenderedClass, GenderSchema, UnitClass, UnitClasses } from "../types";
import { groupBy, parseIntOrThrow } from "../util";

const classAndGenderRegex = /^(?:([A-Z]\w+)|(Floating Eye)) ?(Male|Female)?'s/;
function classAndGenderForLine(line: string) {
  const match = classAndGenderRegex.exec(line);
  if (!match) throw new Error("Error parsing class/gender from line: " + line);
  const className = match[1];
  const floatingEye = match[2];
  const gender = GenderSchema.parse(match[3] || "Monster");
  return {
    className: floatingEye || className,
    gender,
  };
}

const baseStatsRegex =
  /: (\d+) HP, (\d+) MP, (\d+) Move, (\d+) Jump, (\d+) Speed, (\d+) PA, (\d+) MA, (\d+)% C-EV./;
function baseStatsForLine(line: string) {
  const match = baseStatsRegex.exec(line);
  if (!match) throw new Error(`Base stats not found in line: ${line}`);
  const [, hp, mp, move, jump, speed, pa, ma, cEvPercent] = match;
  return {
    hp: parseIntOrThrow(hp),
    mp: parseIntOrThrow(mp),
    move: parseIntOrThrow(move),
    jump: parseIntOrThrow(jump),
    speed: parseIntOrThrow(speed),
    pa: parseIntOrThrow(pa),
    ma: parseIntOrThrow(ma),
    cEvPercent: parseIntOrThrow(cEvPercent),
  };
}

const innatesRegex = /Innate: ([A-Z].+)\. .*$/;
function innatesForLine(line: string): string[] {
  const match = innatesRegex.exec(line);
  if (!match) return [];
  const innatesString = match[1];
  return innatesString.split(", ");
}

function parseClassLine(classLine: string): GenderedClass {
  const { className, gender } = classAndGenderForLine(classLine);
  const baseStats = baseStatsForLine(classLine);
  const innates = innatesForLine(classLine);
  return {
    name: className,
    gender,
    baseStats,
    innates,
    raw: classLine,
  };
}

export function parseClassHelp(classHelp: string): UnitClasses {
  const lines = classHelp.split(/\r?\n/).filter(Boolean);
  const classGenders: GenderedClass[] = lines.map(parseClassLine);
  const grouped = groupBy(classGenders, (c) => c.name);
  const classes: Record<string, UnitClass> = {};
  for (const [className, genderedClasses] of Object.entries(grouped)) {
    if (genderedClasses.length === 1) {
      const [singleGenderClass] = genderedClasses;
      classes[className] = {
        [singleGenderClass.gender]: singleGenderClass,
      };
    } else {
      const maleClass = genderedClasses.find((c) => c.gender === "Male");
      const femaleClass = genderedClasses.find((c) => c.gender === "Female");
      if (!maleClass || !femaleClass) {
        throw new Error(
          `Expected both male and female classes for ${className}. Found: ${JSON.stringify(
            genderedClasses
          )}`
        );
      }
      classes[className] = {
        Male: maleClass,
        Female: femaleClass,
      };
    }
  }
  return classes;
}

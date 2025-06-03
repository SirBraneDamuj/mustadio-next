import { Zodiacs } from "../types";

function parseZodiacLine(zodiacLine: string) {
  const [name, info] = zodiacLine.split(" compatibility: ");
  return {
    name,
    info,
  };
}

export function parseZodiacs(zodiacsDump: string): Zodiacs {
  const zodiacs: Zodiacs = {};
  const zodiacLines = zodiacsDump.trim().split("\n");

  for (const zodiacLine of zodiacLines) {
    if (zodiacLine.trim() === "") continue; // Skip empty lines
    const zodiac = parseZodiacLine(zodiacLine);
    zodiacs[zodiac.name] = zodiac;
  }

  return zodiacs;
}

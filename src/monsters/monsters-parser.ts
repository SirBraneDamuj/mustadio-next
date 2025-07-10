import { MonsterSkills } from "../types";

export function parseMonsters(
  monstersDump: string,
  monsterSkillsDump: string
): MonsterSkills {
  const monsterSkills: MonsterSkills = {};

  const monsterLines = monstersDump.trim().split("\n");
  const skillLines = monsterSkillsDump.trim().split("\n");

  if (monsterLines.length !== skillLines.length) {
    throw new Error(
      "The number of lines in monstersDump and monsterSkillsDump must be equal."
    );
  }

  for (let i = 0; i < monsterLines.length; i++) {
    const monsterName = monsterLines[i].trim();
    const skills = skillLines[i].split("|").map((skill) => skill.trim());
    monsterSkills[monsterName] = {
      name: monsterName,
      skills, // Filter out empty skills
    };
  }

  return monsterSkills;
}

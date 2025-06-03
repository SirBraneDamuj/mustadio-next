import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseMonsters } from "./monsters-parser";

describe("parseMonsters", () => {
  it("parses Monsters.txt and MonsterSkills.txt correctly (snapshot)", async () => {
    const monstersPath = path.join(
      __dirname,
      "../../resources/fftbg_fake/Monsters.txt"
    );
    const skillsPath = path.join(
      __dirname,
      "../../resources/fftbg_fake/MonsterSkills.txt"
    );

    const monstersDump = await fs.readFile(monstersPath, "utf-8");
    const monsterSkillsDump = await fs.readFile(skillsPath, "utf-8");

    const result = parseMonsters(monstersDump, monsterSkillsDump);

    expect(result).toMatchSnapshot();
  });
});

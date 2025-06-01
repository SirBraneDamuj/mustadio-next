import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { TEAM_NAMES, TeamName } from "../types";
import { loadTeamFromString } from "./unit-parser";

const TEAMS_DIR = path.join(__dirname, "../../resources/sample_teams");

async function getResult(teamName: TeamName) {
  const data = await fs.readFile(
    path.join(TEAMS_DIR, `${teamName}.txt`),
    "utf-8"
  );
  return loadTeamFromString(teamName, data);
}

describe("loadTeamFromString", () => {
  TEAM_NAMES.forEach((teamName) => {
    it(`loads the ${teamName} team correctly`, async () => {
      const result = await getResult(teamName);
      expect(result).toMatchSnapshot();
    });
  });
});

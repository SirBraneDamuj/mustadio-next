import { MATCHUPS, TeamName, TeamNameSchema, TournamentWinner } from "../types";
import { modalities } from "../util";

const DEFAULT = ["red", "blue"] as [TeamName, TeamName];

export function getLatestMatchForTournament(
  winners: TeamName[]
): [TeamName, TeamName] {
  const latestMatchNum = winners.length;
  if (latestMatchNum === 8) {
    return ["champion", "champion"];
  }
  if (latestMatchNum < 4) {
    return MATCHUPS[latestMatchNum][0];
  }
  const winFrequencies = modalities(winners);
  if (latestMatchNum < 6) {
    return (
      MATCHUPS[latestMatchNum].find(([team1, team2]) => {
        return winFrequencies[team1] > 0 && winFrequencies[team2] > 0;
      }) || DEFAULT
    );
  }
  if (latestMatchNum === 6) {
    return (
      MATCHUPS[latestMatchNum].find(([team1, team2]) => {
        return winFrequencies[team1] > 1 && winFrequencies[team2] > 1;
      }) || DEFAULT
    );
  }
  if (latestMatchNum === 7) {
    return (
      MATCHUPS[7].find(([team1]) => {
        return winFrequencies[team1] > 2;
      }) || DEFAULT
    );
  }
  return DEFAULT;
}

export function parseWinnersData(winnersData: string): TournamentWinner[] {
  let delimiter = "\r\n";
  if (!winnersData.includes(delimiter)) {
    delimiter = "\n";
  }
  return winnersData
    .split(delimiter)
    .filter((s) => s !== "")
    .map((line, index) => {
      return {
        matchNum: index,
        name: TeamNameSchema.parse(line.trim()),
      };
    });
}

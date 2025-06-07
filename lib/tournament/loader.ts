import { GameDataLoader } from "../loader";
import { Team, TEAM_NAMES, Tournament, TournamentMap } from "../types";
import { loadIndexHtml } from "./index-parser";
import { parseMapsData } from "./maps-parser";
import _tournamentRepo from "./repo";
import { loadTeamFromString } from "./unit-parser";
import { parseWinnersData } from "./winners";

export function tournamentLoader({
  fftbgGameDataLoader,
  tournamentRepo,
}: {
  fftbgGameDataLoader: GameDataLoader;
  tournamentRepo: ReturnType<typeof _tournamentRepo>;
}) {
  async function loadTournamentById(tournamentId: string): Promise<Tournament> {
    const existingTournament =
      await tournamentRepo.getTournamentById(tournamentId);
    if (existingTournament) {
      return existingTournament;
    }
    const teams: Team[] = [];
    for (const teamName of TEAM_NAMES) {
      const data = await fftbgGameDataLoader(`${tournamentId}/${teamName}.txt`);
      const units = loadTeamFromString(teamName, data);
      teams.push({
        name: teamName,
        units,
      });
    }
    const maps = parseMapsData(
      await fftbgGameDataLoader(`/${tournamentId}/maps.txt`)
    );
    const winners = parseWinnersData(
      await fftbgGameDataLoader(`/${tournamentId}/winner.txt`)
    );
    const tournament: Tournament = {
      id: tournamentId,
      teams,
      maps: maps.map((map, index) => ({
        number: map.number,
        title: map.title,
        order: index,
      })) as TournamentMap[],
      winners,
    };
    await tournamentRepo.insertTournament(tournament);
    return tournament;
  }

  async function loadCurrentTournament(): Promise<Tournament> {
    const { latestTournament } = loadIndexHtml(await fftbgGameDataLoader(""));
    return loadTournamentById(latestTournament);
  }

  return {
    loadTournamentById,
    loadCurrentTournament,
  };
}

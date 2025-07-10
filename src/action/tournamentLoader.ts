import { container } from "../app";

export async function loadCurrentTournament() {
  const tournamentLoader = container.resolve("tournamentLoader");
  const tournamentRepo = container.resolve("tournamentRepo");
  const currentTournamentId = await tournamentLoader.getCurrentTournamentId();
  const alreadyLoaded =
    await tournamentRepo.getTournamentById(currentTournamentId);
  if (alreadyLoaded) {
    return alreadyLoaded;
  }
  return tournamentLoader.loadTournamentById(currentTournamentId);
}

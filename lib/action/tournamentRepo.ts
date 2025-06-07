"use server";

import { container } from "../app";
import { Tournament } from "../types";

export async function getTournamentById(
  tournamentId: string
): Promise<Tournament | null> {
  const tournamentRepo = container.resolve("tournamentRepo");
  return tournamentRepo.getTournamentById(tournamentId);
}

export async function loadTournamentById(
  tournamentId: string
): Promise<Tournament> {
  const tournamentLoader = container.resolve("tournamentLoader");
  return tournamentLoader.loadTournamentById(tournamentId);
}

"use server";

import { revalidatePath } from "next/cache";
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

export async function refreshTournamentWinners(
  tournamentId: string
): Promise<void> {
  const tournamentLoader = container.resolve("tournamentLoader");
  tournamentLoader.refreshWinners(tournamentId);
  revalidatePath(`/tournament/${tournamentId}`);
}

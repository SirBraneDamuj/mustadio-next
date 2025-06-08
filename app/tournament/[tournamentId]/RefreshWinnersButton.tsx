"use client";

import { refreshTournamentWinners } from "@/lib/action/tournamentRepo";

export default function RefreshWinnersButton({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const handleRefresh = async () => {
    try {
      refreshTournamentWinners(tournamentId);
    } catch (error) {
      console.error("Failed to refresh winners:", error);
    }
  };

  return (
    <button
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={handleRefresh}
    >
      Refresh Winners
    </button>
  );
}

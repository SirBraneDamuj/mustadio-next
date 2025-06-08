"use client";

import { MATCHUPS, TournamentWinner } from "@/lib/types";
import { cardinalities } from "@/lib/util";
import Link from "next/link";

export default function TournamentMatchupLinks({
  tournamentId,
  winners,
}: {
  tournamentId: string;
  winners: TournamentWinner[];
}) {
  const winCounts = cardinalities(winners.map((w) => w.name));
  console.log("winCounts", winCounts);
  return (
    <ul className="mt-6 space-y-2">
      {MATCHUPS.map((possibleMatchups, roundIndex) => {
        const roundWinner =
          winners.length > roundIndex ? winners[roundIndex].name : null;
        const currentRound = winners.length + 1;
        return (
          <div key={roundIndex}>
            <h3>
              Round {roundIndex + 1}{" "}
              {currentRound === roundIndex
                ? "(current)"
                : `(winner: ${roundWinner})`}
              :
            </h3>
            {possibleMatchups.map((matchup) => {
              const [team1, team2] = matchup;
              // after roundIndex 3, we're in the conditional period
              // where some teams will have been eliminated
              if (roundIndex === 4 || roundIndex === 5) {
                if (
                  (winCounts[team1] || 0) <= 0 ||
                  (winCounts[team2] || 0) <= 0
                ) {
                  return null;
                }
              } else if (roundIndex === 6) {
                // In the finals, we only show matchups for the double winners
                if (
                  (winCounts[team1] || 0) < 2 ||
                  (winCounts[team2] || 0) < 2
                ) {
                  return null;
                }
              } else if (roundIndex === 7) {
                // In the championship, we only show the team that has won 3 times
                if ((winCounts[team1] || 0) < 3) {
                  return null;
                }
              }
              return (
                <li key={`${team1}-${team2}`}>
                  <Link
                    href={`/tournament/${tournamentId}/${team1}/${team2}`}
                    className="text-blue-500 hover:underline"
                  >
                    {team1} vs {team2}
                  </Link>
                </li>
              );
            })}
          </div>
        );
      })}
    </ul>
  );
}

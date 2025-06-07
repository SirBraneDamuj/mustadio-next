"use client";

import { MATCHUPS } from "@/lib/types";
import Link from "next/link";

export default function TournamentMatchupLinks({
  tournamentId,
}: {
  tournamentId: string;
}) {
  return (
    <ul className="mt-6 space-y-2">
      {MATCHUPS.map((possibleMatchups, index) => (
        <div key={index}>
          <h3>Round {index + 1}:</h3>
          {possibleMatchups.map((matchup) => {
            const [team1, team2] = matchup;
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
      ))}
    </ul>
  );
}

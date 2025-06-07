import { container } from "@/lib/app";
import { Tournament } from "@/lib/types";
import TournamentMatchupLinks from "./TournamentMatchupLinks";

export default async function Page({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const tournamentRepo = container.resolve("tournamentRepo");
  const { tournamentId } = await params;
  const tournament: Tournament =
    await tournamentRepo.getTournamentById(tournamentId);
  if (!tournament) {
    return <div>Tournament not found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{tournamentId}</h1>
      <TournamentMatchupLinks tournamentId={tournamentId} />
    </div>
  );
}

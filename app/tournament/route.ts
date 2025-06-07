import { container } from "@/lib/app";
import { redirect } from "next/navigation";

export async function GET() {
  const tournamentLoader = container.resolve("tournamentLoader");
  const currentTournament = await tournamentLoader.loadCurrentTournament();
  redirect(`/tournament/${currentTournament.id}`);
}

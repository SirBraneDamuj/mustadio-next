"use server";
export const dynamic = "force-dynamic";

import { container } from "@/lib/app";
import { CachedFunction } from "@/lib/cache";
import { GameData } from "@/lib/data";
import { Team, Tournament, Unit } from "@/lib/types";

function getClassData(unit: Unit, gameData: GameData) {
  const classObj = gameData.classes[unit.class];
  if (!classObj) return undefined;
  if ("Monster" in classObj && unit.gender === "Monster")
    return classObj.Monster;
  if ("Male" in classObj && unit.gender === "Male") return classObj.Male;
  if ("Female" in classObj && unit.gender === "Female") return classObj.Female;
  // fallback: return the first available key
  if ("Monster" in classObj) return classObj.Monster;
  if ("Male" in classObj) return classObj.Male;
  if ("Female" in classObj) return classObj.Female;
  return undefined;
}

function getInnateStatuses(innates: string[], gameData: GameData) {
  return innates.filter((innate) => gameData.statuses[innate]);
}

function getInnateAbilities(innates: string[], gameData: GameData) {
  return innates.filter((innate) => gameData.abilities[innate]);
}

function TeamTable({ team, gameData }: { team: Team; gameData: GameData }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 capitalize">{team.name} Team</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Unit</th>
            <th className="p-2 border">Stats</th>
            <th className="p-2 border">Equipment</th>
            <th className="p-2 border">Abilities</th>
            <th className="p-2 border">Main Abilities</th>
            <th className="p-2 border">Sub Abilities</th>
          </tr>
        </thead>
        <tbody>
          {team.units.map((unit: Unit, idx: number) => {
            const classData = getClassData(unit, gameData);
            const baseStats = classData?.baseStats;
            const innates = classData?.innates || [];
            const innateStatuses = getInnateStatuses(innates, gameData);
            const innateAbilities = getInnateAbilities(innates, gameData);
            return (
              <tr key={idx} className="border-t">
                {/* 1. Unit name, class, zodiac, brave, faith */}
                <td className="p-2 align-top">
                  <div className="font-semibold">{unit.name}</div>
                  <div className="text-sm text-gray-700">{unit.class}</div>
                  <div className="text-xs text-gray-500">{unit.zodiac}</div>
                  <div className="text-xs mt-1">
                    B: {unit.brave} / F: {unit.faith}
                  </div>
                </td>
                {/* 2. Base stats and innate statuses */}
                <td className="p-2 align-top text-xs">
                  {baseStats ? (
                    <div>
                      <div>HP: {baseStats.hp}</div>
                      <div>MP: {baseStats.mp}</div>
                      <div>Move: {baseStats.move}</div>
                      <div>Jump: {baseStats.jump}</div>
                      <div>Speed: {baseStats.speed}</div>
                      <div>PA: {baseStats.pa}</div>
                      <div>MA: {baseStats.ma}</div>
                      <div>C-EV: {baseStats.cEvPercent}%</div>
                    </div>
                  ) : (
                    <div className="italic text-gray-400">No class data</div>
                  )}
                  {innateStatuses.length > 0 && (
                    <div className="mt-2">
                      <div className="font-semibold text-xs">Innates:</div>
                      <ul className="list-disc ml-4">
                        {innateStatuses.map((inn: string, i: number) => (
                          <li key={i}>{inn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                {/* 3. Equipment */}
                <td className="p-2 align-top text-xs">
                  {unit.equipment && unit.equipment.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {unit.equipment.map((eq: string, i: number) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">None</span>
                  )}
                </td>
                {/* 4. Abilities (innate abilities only) */}
                <td className="p-2 align-top text-xs">
                  {innateAbilities.length > 0 ? (
                    <div>
                      <div className="font-semibold text-xs">Innates:</div>
                      <ul className="list-disc ml-4">
                        {innateAbilities.map((inn: string, i: number) => (
                          <li key={i}>{inn}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">None</span>
                  )}
                </td>
                {/* 5. Main Abilities */}
                <td className="p-2 align-top text-xs">
                  {unit.mainAbilities && unit.mainAbilities.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {unit.mainAbilities.map((ab: string, i: number) => (
                        <li key={i}>{ab}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">None</span>
                  )}
                </td>
                {/* 6. Sub Abilities */}
                <td className="p-2 align-top text-xs">
                  {unit.subAbilities && unit.subAbilities.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {unit.subAbilities.map((ab: string, i: number) => (
                        <li key={i}>{ab}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">None</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ tournamentId: string; teamOne: string; teamTwo: string }>;
}) {
  const { tournamentId, teamOne, teamTwo } = await params;
  const tournamentRepo = container.resolve("tournamentRepo");
  const dataCache: CachedFunction<GameData> =
    container.resolve("fftbgGameData");
  const data: GameData = await dataCache.get();
  const tournament: Tournament =
    await tournamentRepo.getTournamentById(tournamentId);

  const teamA = tournament.teams.find((t) => t.name === teamOne);
  const teamB = tournament.teams.find((t) => t.name === teamTwo);

  if (!teamA || !teamB) {
    return <div>One or both teams not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <TeamTable team={teamA} gameData={data} />
      <TeamTable team={teamB} gameData={data} />
    </div>
  );
}

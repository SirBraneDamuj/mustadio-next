"use server";

import prisma from "@/lib/prisma";
import { TeamNameSchema, Tournament } from "../types";

export async function getTournamentById(
  tournamentId: string
): Promise<Tournament> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: {
        include: {
          units: {
            include: {
              abilities: true,
              equipment: true,
            },
          },
        },
      },
      maps: true,
      winners: true,
    },
  });

  if (!tournament) {
    throw Error(`Tournament with ID ${tournamentId} not found`);
  }

  return {
    ...tournament,
    teams: tournament.teams.map((team) => {
      const teamName = TeamNameSchema.parse(team.name);

      return {
        ...team,
        name: teamName,
        units: team.units.map((unit) => ({
          ...unit,
          teamName,
          mainAbilities: unit.abilities
            .filter((ability) => ability.mainOrSub === "main")
            .map(({ name }) => ({ name })),
          subAbilities: unit.abilities
            .filter((ability) => ability.mainOrSub === "sub")
            .map(({ name }) => ({ name })),
          equipment: (unit.equipment || []).map((equip) => ({
            ...equip,
            // TODO: actually get these
            slot: "head",
            type: "Helmet",
            // slot: EquipmentSlotSchema.parse(equip.slot),
            // type: EquipmentTypeSchema.parse(equip.type),
          })),
        })),
      };
    }),
  };
}

export async function insertTournament(tournament: Tournament): Promise<void> {
  await prisma.tournament.create({
    data: {
      ...tournament,
      teams: {
        create: tournament.teams.map((team) => ({
          name: TeamNameSchema.parse(team.name),
          units: {
            create: team.units.map((unit) => {
              const abilities = [
                ...unit.mainAbilities.map((ability) => ({
                  name: ability.name,
                  mainOrSub: "main" as const,
                })),
                ...unit.subAbilities.map((ability) => ({
                  name: ability.name,
                  mainOrSub: "sub" as const,
                })),
              ];
              return {
                ...unit,
                teamName: TeamNameSchema.parse(unit.teamName),
                abilities: {
                  create: abilities,
                },
                equipment: {
                  create: unit.equipment.map((equip) => ({
                    name: equip.name,
                  })),
                },
              };
            }),
          },
        })),
      },
      maps: {
        create: tournament.maps,
      },
      winners: {
        create: tournament.winners,
      },
    },
  });
}

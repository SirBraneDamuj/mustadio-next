import getPrismaClient from "@/lib/prisma";
import { TeamNameSchema, Tournament, Unit } from "../types";
import { pick } from "../util";

export default function tournamentRepo({
  prisma,
}: {
  // TODO: figure out a more generic type
  prisma: ReturnType<typeof getPrismaClient>;
}) {
  async function getTournamentById(
    tournamentId: string
  ): Promise<Tournament | null> {
    console.log("Fetching tournament with ID:", tournamentId);
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
      return null;
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
              .map(({ name }) => name),
            subAbilities: unit.abilities
              .filter((ability) => ability.mainOrSub === "sub")
              .map(({ name }) => name),
            equipment: (unit.equipment || []).map(({ name }) => name),
          })),
        };
      }),
    };
  }

  async function insertTournament(tournament: Tournament): Promise<void> {
    await prisma.tournament.create({
      data: {
        ...tournament,
        teams: {
          create: tournament.teams.map((team) => ({
            name: TeamNameSchema.parse(team.name),
            units: {
              create: team.units.map((unit: Unit) => {
                const abilities = [
                  ...unit.mainAbilities.map((ability) => ({
                    name: ability,
                    mainOrSub: "main" as const,
                  })),
                  ...unit.subAbilities.map((ability) => ({
                    name: ability,
                    mainOrSub: "sub" as const,
                  })),
                ];
                return {
                  ...pick(
                    unit,
                    "name",
                    "gender",
                    "zodiac",
                    "brave",
                    "faith",
                    "class",
                    "subSkill",
                    "reactSkill",
                    "supportSkill",
                    "moveSkill",
                    "raw",
                    "order"
                  ),
                  teamName: TeamNameSchema.parse(unit.teamName),
                  abilities: {
                    create: abilities,
                  },
                  equipment: {
                    create: unit.equipment.map((equip) => ({
                      name: equip,
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

  return {
    getTournamentById,
    insertTournament,
  };
}

import * as awilix from "awilix";
import { getGameData } from "./data";
import { getGameDataLoader } from "./loader";
import getPrismaClient from "./prisma";
import { tournamentLoader } from "./tournament/loader";
import tournamentRepo from "./tournament/repo";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  fftbgLoaderStrategy: awilix.asValue(process.env.FFTBG_STRATEGY || "fake"),
  fftbgBaseUrl: awilix.asValue(process.env.FFTBG_BASE_URL || "not_set"),
  fftbgGameDataLoader: awilix.asFunction(getGameDataLoader).singleton(),
  fftbgGameData: awilix.asFunction(getGameData).singleton(),
  prisma: awilix.asFunction(getPrismaClient).singleton(),
  tournamentRepo: awilix.asFunction(tournamentRepo).singleton(),
  tournamentLoader: awilix.asFunction(tournamentLoader).singleton(),
});

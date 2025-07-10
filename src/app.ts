import * as awilix from "awilix";
import { healthCheckHandler } from "./api";
import { getGameData } from "./data";
import { getGameDataLoader } from "./loader";
import getPrismaClient from "./prisma";
import { createServer, ServerDependencies } from "./server";
import { tournamentLoader } from "./tournament/loader";
import tournamentRepo from "./tournament/repo";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

// Function to create server dependencies from the container
function createServerDependencies(
  container: awilix.AwilixContainer
): ServerDependencies {
  return {
    apiHandlers: container.resolve("apiHandlers"),
    apiContext: {
      // Add any common dependencies that handlers might need
      // For now, keeping it simple
    },
  };
}

container.register({
  fftbgLoaderStrategy: awilix.asValue(process.env.FFTBG_STRATEGY || "fake"),
  fftbgBaseUrl: awilix.asValue(process.env.FFTBG_BASE_URL || "not_set"),
  fftbgGameDataLoader: awilix.asFunction(getGameDataLoader).singleton(),
  fftbgGameData: awilix.asFunction(getGameData).singleton(),
  prisma: awilix.asFunction(getPrismaClient).singleton(),
  tournamentRepo: awilix.asFunction(tournamentRepo).singleton(),
  tournamentLoader: awilix.asFunction(tournamentLoader).singleton(),
  apiHandlers: awilix.asValue([healthCheckHandler]),
  server: awilix
    .asFunction(() => createServer(createServerDependencies(container)))
    .singleton(),
});

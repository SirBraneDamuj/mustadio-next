import * as awilix from "awilix";
import { getGameData } from "./data";
import { getGameDataLoader } from "./loader";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  fftbgLoaderStrategy: awilix.asValue(process.env.FFTBG_STRATEGY || "fake"),
  fftbgBaseUrl: awilix.asValue(process.env.FFTBG_BASE_URL || "not_set"),
  fftbgGameDataLoader: awilix.asFunction(getGameDataLoader).singleton(),
  fftbgGameData: awilix.asFunction(getGameData).singleton(),
});

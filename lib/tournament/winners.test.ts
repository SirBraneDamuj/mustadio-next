import { describe, expect, it } from "vitest";
import { TeamName } from "../types";
import { getLatestMatchForTournament } from "./winners";

describe("getLatestMatchForTournament", () => {
  const subject = (winners: TeamName[]) => getLatestMatchForTournament(winners);

  it("returns red and blue for a brand new tournament", () => {
    expect(subject([])).toEqual(["red", "blue"]);
  });

  it("returns green and yellow after a single match", () => {
    expect(subject(["red"])).toEqual(["green", "yellow"]);
  });

  it("returns white and black after two matches", () => {
    expect(subject(["red", "yellow"])).toEqual(["white", "black"]);
  });

  it("returns purple and brown after three matches", () => {
    expect(subject(["red", "yellow", "white"])).toEqual(["purple", "brown"]);
  });

  it("returns red and yellow after the first round", () => {
    expect(subject(["red", "yellow", "white", "brown"])).toEqual([
      "red",
      "yellow",
    ]);
  });

  it("returns white and brown after the first round", () => {
    expect(subject(["red", "yellow", "white", "brown", "yellow"])).toEqual([
      "white",
      "brown",
    ]);
  });

  it("returns yellow and brown after the second round", () => {
    expect(
      subject(["red", "yellow", "white", "brown", "yellow", "brown"])
    ).toEqual(["yellow", "brown"]);
  });

  it("returns brown and champion for the champ round", () => {
    expect(
      subject(["red", "yellow", "white", "brown", "yellow", "brown", "brown"])
    ).toEqual(["brown", "champion"]);
  });

  it("returns double champion if the match is over", () => {
    expect(
      subject([
        "red",
        "yellow",
        "white",
        "brown",
        "yellow",
        "brown",
        "brown",
        "champion",
      ])
    ).toEqual(["champion", "champion"]);
  });

  it("returns the default red blue matchup for anything strange", () => {
    expect(
      subject([
        "red",
        "yellow",
        "white",
        "brown",
        "yellow",
        "brown",
        "brown",
        "champion",
        "red",
        "yellow",
        "white",
        "brown",
        "yellow",
        "brown",
        "brown",
        "champion",
      ])
    ).toEqual(["red", "blue"]);
  });
});

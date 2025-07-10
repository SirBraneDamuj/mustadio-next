import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseMapsData } from "./maps-parser";

describe("parseMapsData", () => {
  it("parses maps.txt correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/fake_tournament/maps.txt"
    );
    const file = await fs.readFile(filePath, "utf-8");
    const result = parseMapsData(file);

    expect(result).toMatchSnapshot();
  });
});

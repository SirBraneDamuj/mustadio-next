import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseZodiacs } from "./zodiac-parser";

describe("parseZodiacs", () => {
  it("parses zodiachelp.txt correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/zodiachelp.txt"
    );
    const file = await fs.readFile(filePath, "utf-8");
    const result = parseZodiacs(file);

    expect(result).toMatchSnapshot();
  });
});

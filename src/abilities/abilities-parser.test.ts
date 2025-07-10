import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseAbilities } from "./abilities-parser";

describe("parseAbilities", () => {
  it("parses infoability.txt correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/infoability.txt"
    );
    const file = await fs.readFile(filePath, "utf-8");
    const result = parseAbilities(file);

    expect(result).toMatchSnapshot();
  });
});

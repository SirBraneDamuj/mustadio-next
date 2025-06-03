import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseItemsDump } from "./items-parser";

describe("parseItemsDump", () => {
  it("parses infoitem.txt correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/infoitem.txt"
    );
    const file = await fs.readFile(filePath, "utf-8");
    const result = parseItemsDump(file);

    expect(result).toMatchSnapshot();
  });
});

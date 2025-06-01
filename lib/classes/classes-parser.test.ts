import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parseClassHelp } from "./classes-parser";

describe("parseClassHelp", () => {
  it("parses classhelp.txt correctly (snapshot)", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../resources/fftbg_fake/classhelp.txt"
    );
    const classHelpText = await fs.readFile(filePath, "utf8");
    const result = parseClassHelp(classHelpText);
    expect(result).toMatchSnapshot();
  });
});

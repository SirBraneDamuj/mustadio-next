import { describe, it, expect } from "vitest";
import { parseStatuses } from "./statuses-parser";
import { promises as fs } from "fs";
import path from "path";

describe("parseStatuses", () => {
  it("parses infostatus.txt correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/infostatus.txt"
    );
    const file = await fs.readFile(filePath, "utf-8");
    const result = parseStatuses(file);

    expect(result).toMatchSnapshot();
  });
});
import { promises as fs } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { loadIndexHtml } from "./index-parser";

describe("loadIndexHtml", () => {
  it("parses index.html correctly (snapshot)", async () => {
    const filePath = path.join(
      __dirname,
      "../../resources/fftbg_fake/index.html"
    );
    const html = await fs.readFile(filePath, "utf-8");
    const result = loadIndexHtml(html);

    expect(result).toMatchSnapshot();
  });
});

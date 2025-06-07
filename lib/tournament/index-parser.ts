import { JSDOM } from "jsdom";

type DumpFile = {
  name: string;
  timestamp: string;
};

type IndexHtml = {
  latestTournament: string;
  dumpFiles: DumpFile[];
};

export function loadIndexHtml(html: string): IndexHtml {
  const { window } = new JSDOM(html);
  const document = window.document;
  let latestTournament = "";
  const dumpFiles = [];
  const linkNodes = document.querySelectorAll("tr > td > a");
  for (const node of linkNodes) {
    const href = node.getAttribute("href");
    if (!href) {
      continue;
    }
    if (href.startsWith("tournament_")) {
      if (href > latestTournament) {
        latestTournament = href;
      }
    } else if (href.endsWith(".txt")) {
      const timestamp =
        node.parentNode?.nextSibling?.textContent?.trim() || "no timestamp";
      dumpFiles.push({
        name: href,
        timestamp,
      });
    }
  }
  return {
    dumpFiles,
    latestTournament: latestTournament.slice(0, -1),
  };
}

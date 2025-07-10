import { Statuses } from "../types";

const parseStatusLine = (statusLine: string) => {
  const firstColon = statusLine.indexOf(":");
  const name = statusLine.slice(0, firstColon);
  const info = statusLine.slice(firstColon + 2);
  return {
    name,
    info,
  };
};

export function parseStatuses(statusesDump: string): Statuses {
  const statuses: Statuses = {};
  const statusLines = statusesDump.trim().split("\n");

  for (const statusLine of statusLines) {
    if (statusLine.trim() === "") continue; // Skip empty lines
    const status = parseStatusLine(statusLine);
    statuses[status.name] = status;
  }

  return statuses;
}

const mapRegex = /^(?<mapNumber>\d+)\) (?<mapTitle>.*)$/;

type Map = {
  number: string;
  title: string;
};

export function parseMapsData(data: string) {
  let delimiter = "\r\n";
  if (data.indexOf(delimiter) == -1) {
    delimiter = "\n";
  }
  return data.split(delimiter).reduce((maps, mapLine) => {
    const regexResult = mapRegex.exec(mapLine);
    if (regexResult) {
      if (!regexResult.groups) {
        throw new Error("Maps Regex did not match expected groups");
      }
      const { mapNumber, mapTitle } = regexResult.groups;
      maps.push({
        number: mapNumber,
        title: mapTitle,
      });
    }
    return maps;
  }, [] as Map[]);
}

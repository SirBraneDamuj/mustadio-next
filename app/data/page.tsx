import { refreshGameData } from "@/lib/data";

export default async function Page() {
  const gameData = await refreshGameData();

  return (
    <main>
      {Object.entries(gameData).map(([section, data]) => (
        <section key={section}>
          <h2>{section}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
      ))}
    </main>
  );
}

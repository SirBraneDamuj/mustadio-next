import gameData from "@/lib/action/gameData";
export default async function Page() {
  const allGameData = await gameData();

  return (
    <main>
      {Object.entries(allGameData).map(([section, data]) => (
        <section key={section}>
          <h2>{section}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
      ))}
    </main>
  );
}

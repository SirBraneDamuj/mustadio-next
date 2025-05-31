export default async function Page({
  params,
}: {
  params: { tournamentId: string; teamOne: string; teamTwo: string };
}) {
  const { tournamentId, teamOne, teamTwo } = params;

  return (
    <div>
      <h1>Tournament ID: {tournamentId}</h1>
      <h2>Team One: {teamOne}</h2>
      <h2>Team Two: {teamTwo}</h2>
    </div>
  );
}

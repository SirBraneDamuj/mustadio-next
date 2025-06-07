export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Loading Current Tournament...</h1>
      <p className="text-lg">Please wait while we fetch the tournament data.</p>
    </div>
  );
}

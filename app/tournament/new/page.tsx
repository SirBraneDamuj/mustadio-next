"use client";

import { insertTournament } from "@/lib/tournament/repo";
import type { Tournament } from "@/lib/types";
import React, { useState } from "react";

// Stub for Tournament type and parsing function

function parseTournament(json: string): Tournament | null {
  // TODO: Implement actual parsing logic
  try {
    // Replace this with real parsing
    return JSON.parse(json) as Tournament;
  } catch {
    return null;
  }
}

export default function NewTournamentPage() {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const tournament = parseTournament(json);
    if (!tournament) {
      setError("Invalid JSON or unable to parse Tournament.");
      return;
    }

    try {
      await insertTournament(tournament);
      setSuccess(true);
      setJson("");
    } catch {
      setError("Failed to insert tournament.");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Import Tournament JSON</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-48 p-2 border rounded mb-2"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Paste tournament JSON here"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Import
        </button>
      </form>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && (
        <div className="text-green-600 mt-2">Tournament imported!</div>
      )}
    </div>
  );
}

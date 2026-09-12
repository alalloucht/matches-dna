import type { Match } from "../types/match";

const API_URL = "http://localhost:3000/matches";

/**
 * GET /matches
 * Récupérer tous les matches
 */
export async function getMatches(): Promise<Match[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch matches");
  }

  return response.json();
}

/**
 * GET /matches/:id
 * Récupérer un match par son ID
 */
export async function getMatchById(id: number): Promise<Match> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Match not found");
    }

    throw new Error("Failed to fetch match");
  }

  return response.json();
}

/**
 * POST /matches
 * Créer un nouveau match
 */
export async function createMatch(
  data: Omit<Match, "id" | "createdAt" | "updatedAt">
): Promise<Match> {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error || "Failed to create match"
    );
  }

  return response.json();
}

/**
 * PUT /matches/:id
 * Modifier un match
 */
export async function updateMatch(
  id: number,
  data: Omit<Match, "id" | "createdAt" | "updatedAt">
): Promise<Match> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    if (response.status === 404) {
      throw new Error("Match not found");
    }

    throw new Error(
      error?.error || "Failed to update match"
    );
  }

  return response.json();
}

/**
 * DELETE /matches/:id
 * Supprimer un match
 */
export async function deleteMatch(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    if (response.status === 404) {
      throw new Error("Match not found");
    }

    throw new Error(
      error?.error || "Failed to delete match"
    );
  }
}

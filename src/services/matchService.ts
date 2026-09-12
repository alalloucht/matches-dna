import type { Match } from "../types/match";

// ============================================================
// API CONFIG
// ============================================================

const API_URL = "http://localhost:3000/matches";


// ============================================================
// TYPES
// ============================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface PaginatedMatches {
  data: Match[];
  pagination: Pagination;
}


// ============================================================
// SEARCH + FILTER PARAMETERS
// ============================================================

export interface MatchFilters {

  search?: string;

  pays?: string;

  region?: string;

  province?: string;

  ydnahaplogroup?: string;

  ydnasubclade?: string;

  mtdna?: string;

  tribe?: string;
}


// ============================================================
// GET /matches
//
// Pagination + Search + Filters
//
// Example:
//
// getMatches(1, 50)
//
// getMatches(1, 50, {
//   search: "Amrani",
//   pays: "المغرب"
// })
//
// Generates:
//
// /matches?page=1
//         &limit=50
//         &search=Amrani
//         &pays=المغرب
// ============================================================

export async function getMatches(
  page: number = 1,
  limit: number = 50,
  filters: MatchFilters = {}
): Promise<PaginatedMatches> {


  // ==========================================================
  // QUERY PARAMETERS
  // ==========================================================

  const params =
    new URLSearchParams();


  // Pagination

  params.set(
    "page",
    String(page)
  );


  params.set(
    "limit",
    String(limit)
  );


  // ==========================================================
  // SEARCH
  // ==========================================================

  if (
    filters.search &&
    filters.search.trim()
  ) {

    params.set(
      "search",
      filters.search.trim()
    );

  }


  // ==========================================================
  // COUNTRY
  // ==========================================================

  if (
    filters.pays &&
    filters.pays.trim()
  ) {

    params.set(
      "pays",
      filters.pays.trim()
    );

  }


  // ==========================================================
  // REGION
  // ==========================================================

  if (
    filters.region &&
    filters.region.trim()
  ) {

    params.set(
      "region",
      filters.region.trim()
    );

  }


  // ==========================================================
  // PROVINCE
  // ==========================================================

  if (
    filters.province &&
    filters.province.trim()
  ) {

    params.set(
      "province",
      filters.province.trim()
    );

  }


  // ==========================================================
  // Y-DNA HAPLOGROUP
  // ==========================================================

  if (
    filters.ydnahaplogroup &&
    filters.ydnahaplogroup.trim()
  ) {

    params.set(
      "ydnahaplogroup",
      filters.ydnahaplogroup.trim()
    );

  }


  // ==========================================================
  // Y-DNA SUBCLADE
  // ==========================================================

  if (
    filters.ydnasubclade &&
    filters.ydnasubclade.trim()
  ) {

    params.set(
      "ydnasubclade",
      filters.ydnasubclade.trim()
    );

  }


  // ==========================================================
  // mtDNA
  // ==========================================================

  if (
    filters.mtdna &&
    filters.mtdna.trim()
  ) {

    params.set(
      "mtdna",
      filters.mtdna.trim()
    );

  }


  // ==========================================================
  // TRIBE
  // ==========================================================

  if (
    filters.tribe &&
    filters.tribe.trim()
  ) {

    params.set(
      "tribe",
      filters.tribe.trim()
    );

  }


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}?${params.toString()}`
    );


  // ==========================================================
  // ERROR
  // ==========================================================

  if (!response.ok) {

    const error =
      await response
        .json()
        .catch(() => null);


    throw new Error(
      error?.error ||
      "Failed to fetch matches"
    );

  }


  // ==========================================================
  // RESPONSE
  // ==========================================================

  return response.json();

}


// ============================================================
// GET /matches/:id
// Get one match
// ============================================================

export async function getMatchById(
  id: number
): Promise<Match> {

  const response =
    await fetch(
      `${API_URL}/${id}`
    );


  if (!response.ok) {

    if (
      response.status === 404
    ) {

      throw new Error(
        "Match not found"
      );

    }


    const error =
      await response
        .json()
        .catch(() => null);


    throw new Error(
      error?.error ||
      "Failed to fetch match"
    );

  }


  return response.json();

}


// ============================================================
// POST /matches
// Create a new match
// ============================================================

export async function createMatch(
  data: Omit<
    Match,
    "id" |
    "createdAt" |
    "updatedAt"
  >
): Promise<Match> {

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(data)
      }
    );


  if (!response.ok) {

    const error =
      await response
        .json()
        .catch(() => null);


    throw new Error(
      error?.error ||
      "Failed to create match"
    );

  }


  return response.json();

}


// ============================================================
// PUT /matches/:id
// Update a match
// ============================================================

export async function updateMatch(
  id: number,
  data: Omit<
    Match,
    "id" |
    "createdAt" |
    "updatedAt"
  >
): Promise<Match> {

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(data)
      }
    );


  if (!response.ok) {

    const error =
      await response
        .json()
        .catch(() => null);


    if (
      response.status === 404
    ) {

      throw new Error(
        "Match not found"
      );

    }


    throw new Error(
      error?.error ||
      "Failed to update match"
    );

  }


  return response.json();

}


// ============================================================
// DELETE /matches/:id
// Delete a match
// ============================================================

export async function deleteMatch(
  id: number
): Promise<void> {

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );


  if (!response.ok) {

    const error =
      await response
        .json()
        .catch(() => null);


    if (
      response.status === 404
    ) {

      throw new Error(
        "Match not found"
      );

    }


    throw new Error(
      error?.error ||
      "Failed to delete match"
    );

  }

}

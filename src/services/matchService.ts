import type { Match } from "../types/match";


// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  "http://localhost:3000/matches";


// ============================================================
// TYPES
// ============================================================


// ============================================================
// PAGINATION
// ============================================================

export interface Pagination {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

}


// ============================================================
// PAGINATED MATCHES
// ============================================================

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
// DASHBOARD STATISTICS
// ============================================================

export interface MatchStats {

  total: number;

  today: number;

  thisWeek: number;

  thisMonth: number;

}


// ============================================================
// RECENT MATCHES
// ============================================================

export interface RecentMatchesResponse {

  data: Match[];

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


  // ==========================================================
  // PAGINATION
  // ==========================================================

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
// GET /matches/stats
//
// Dashboard statistics
//
// Example:
//
// GET http://localhost:3000/matches/stats
//
// Expected response:
//
// {
//   "total": 61414,
//   "today": 10,
//   "thisWeek": 85,
//   "thisMonth": 320
// }
// ============================================================

export async function getMatchStats(): Promise<MatchStats> {


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/stats`
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
      "Failed to fetch match statistics"
    );

  }


  // ==========================================================
  // RESPONSE
  // ==========================================================

  const result =
    await response.json();


  // ==========================================================
  // VALIDATE / NORMALIZE
  // ==========================================================

  return {

    total:
      Number(
        result.total ?? 0
      ),

    today:
      Number(
        result.today ?? 0
      ),

    thisWeek:
      Number(
        result.thisWeek ?? 0
      ),

    thisMonth:
      Number(
        result.thisMonth ?? 0
      ),

  };

}


// ============================================================
// GET /matches/recent
//
// Get recently added matches
//
// Example:
//
// GET http://localhost:3000/matches/recent?limit=10
//
// Expected response:
//
// {
//   "data": [
//     {
//       "id": 100,
//       "fullname": "John Doe",
//       ...
//     }
//   ]
// }
// ============================================================

export async function getRecentMatches(
  limit: number = 10
): Promise<Match[]> {


  // ==========================================================
  // SAFE LIMIT
  // ==========================================================

  const safeLimit =
    Math.min(
      Math.max(
        Math.floor(limit),
        1
      ),
      100
    );


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/recent?limit=${safeLimit}`
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
      "Failed to fetch recent matches"
    );

  }


  // ==========================================================
  // RESPONSE
  // ==========================================================

  const result =
    await response.json();


  // ==========================================================
  // RESPONSE FORMAT
  //
  // Expected:
  //
  // {
  //   data: [...]
  // }
  //
  // But we also support:
  //
  // [...]
  // ==========================================================

  if (
    Array.isArray(result)
  ) {

    return result;

  }


  if (
    result &&
    Array.isArray(
      result.data
    )
  ) {

    return result.data;

  }


  return [];

}


// ============================================================
// GET /matches/:id
//
// Get one match
// ============================================================

export async function getMatchById(
  id: number
): Promise<Match> {


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/${id}`
    );


  // ==========================================================
  // ERROR
  // ==========================================================

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


  // ==========================================================
  // RESPONSE
  // ==========================================================

  return response.json();

}


// ============================================================
// POST /matches
//
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


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      API_URL,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            data
          )

      }
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
      "Failed to create match"
    );

  }


  // ==========================================================
  // RESPONSE
  // ==========================================================

  return response.json();

}


// ============================================================
// PUT /matches/:id
//
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


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method:
          "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            data
          )

      }
    );


  // ==========================================================
  // ERROR
  // ==========================================================

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


  // ==========================================================
  // RESPONSE
  // ==========================================================

  return response.json();

}


// ============================================================
// DELETE /matches/:id
//
// Delete a match
// ============================================================

export async function deleteMatch(
  id: number
): Promise<void> {


  // ==========================================================
  // REQUEST
  // ==========================================================

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method:
          "DELETE"
      }
    );


  // ==========================================================
  // ERROR
  // ==========================================================

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
import type { Match } from "../types/match";


let matches: Match[] = [];


export function getMatches(): Match[] {
  return matches;
}


export function getMatchById(
  id: number
): Match | undefined {

  return matches.find(
    (match) => match.id === id
  );
}


export function createMatch(
  data: Omit<
    Match,
    "id" | "createdAt" | "updatedAt"
  >
): Match {

  const now =
    new Date().toISOString();


  const match: Match = {
    id: Date.now(),

    ...data,

    createdAt: now,
    updatedAt: now,
  };


  matches.push(match);

  return match;
}


export function updateMatch(
  id: number,

  data: Partial<
    Omit<
      Match,
      "id" | "createdAt" | "updatedAt"
    >
  >
): Match | undefined {

  const match =
    getMatchById(id);


  if (!match) {
    return undefined;
  }


  Object.assign(
    match,
    data
  );


  match.updatedAt =
    new Date().toISOString();


  return match;
}


export function deleteMatch(
  id: number
): boolean {

  const index =
    matches.findIndex(
      (match) => match.id === id
    );


  if (index === -1) {
    return false;
  }


  matches.splice(index, 1);

  return true;
}
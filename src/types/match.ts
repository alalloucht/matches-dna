export interface Match {
  id: number;

  fullname: string;
  firstname: string | null;
  middlename: string | null;
  lastname: string | null;
  ancestralsurname: string | null;

  ydnahaplogroup: string | null;
  ydnasubclade: string | null;
  mtdna: string | null;

  pays: string | null;
  region: string | null;
  province: string | null;
  commun: string | null;
  tribe: string | null;

  details: string | null;

  createdAt: string | null;
  updatedAt: string | null;
}
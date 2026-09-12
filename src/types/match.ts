export interface Match {
  id: number;

  fullname: string;
  firstname: string;
  middlename: string;
  lastname: string;
  ancestralsurname: string;

  ydnahaplogroup: string;
  ydnasubclade: string;
  mtdna: string;

  pays: string;
  region: string;
  province: string;
  commun: string;
  tribe: string;

  details: string;

  createdAt: string;
  updatedAt: string;
}
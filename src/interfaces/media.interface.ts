export interface MediaSource {
  bildnummer: string;
  datum: string;
  suchtext: string;
  fotografen: string;
  hoehe: number;
  breite: number;
  db: string;
}

export interface MediaResponse {
  id: string;
  title: string;
  description: string;
  photographer: string;
  height: number;
  width: number;
  date: string;
  source: string;
}

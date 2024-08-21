export interface Show {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  birthday: string;
}

export interface CastItem {
  person: Person;
}

export interface ScrapedShow {
  id: number;
  name: string;
  cast: {
    id: number;
    name: string;
    birthday: string;
  }[];
}

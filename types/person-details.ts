export interface PersonDetails {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: Date | null;
  deathday: Date | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

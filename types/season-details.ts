export interface SeasonDetails {
  _id: string;
  air_date: Date;
  episodes: Episode[];
  name: string;
  overview: string | undefined;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  air_date: Date;
  episode_number: number;
  episode_type: EpisodeType;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: Crew[];
}

export interface Crew {
  department?: Department;
  job?: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: Department;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  character?: string;
  order?: number;
}

export enum Department {
  Acting = "Acting",
  Art = "Art",
  Camera = "Camera",
  Crew = "Crew",
  Directing = "Directing",
  Production = "Production",
  Writing = "Writing",
}

export enum EpisodeType {
  Finale = "finale",
  Standard = "standard",
}

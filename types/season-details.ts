export interface SeasonDetails {
  _id: string;
  air_date: Date;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
  videos: VideoResult;
  images: Images;
}

export interface Episode {
  air_date: Date;
  episode_number: number;
  episode_type: string;
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
  job?: string;
  department?: Department;
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
  Camera = "Camera",
  Crew = "Crew",
  Directing = "Directing",
  Editing = "Editing",
  Production = "Production",
  VisualEffects = "Visual Effects",
  Writing = "Writing",
}

export interface Images {
  posters: any[];
}

export interface VideoResult {
  results: Video[];
}

export interface Video {
  iso_639_1: ISO639_1;
  iso_3166_1: ISO3166_1;
  name: string;
  key: string;
  site: Site;
  size: number;
  type: string;
  official: boolean;
  published_at: Date;
  id: string;
}

export enum ISO3166_1 {
  Us = "US",
}

export enum ISO639_1 {
  En = "en",
}

export enum Site {
  YouTube = "YouTube",
}

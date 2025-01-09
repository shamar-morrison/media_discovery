import { MediaType } from "@/types/multi-search";

export interface CombinedCreditsResult {
  cast: CombinedCredits[];
  crew: CombinedCredits[];
  id: number;
}

export interface CombinedCredits {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  original_language: OriginalLanguage;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date?: string;
  title?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  media_type: MediaType.Movie | MediaType.Tv;
  origin_country?: OriginCountry[];
  original_name?: string;
  first_air_date?: string;
  name?: string;
  episode_count?: number;
  department?: string;
  job?: string;
}

export interface MovieCredits {
  adult: boolean;
  backdrop_path: string;
  character: string;
  credit_id: string;
  genre_ids: number[];
  id: number;
  media_type: MediaType.Movie;
  order: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TvShowCredits {
  adult: boolean;
  backdrop_path: string;
  character: string;
  credit_id: string;
  episode_count: number;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  media_type: MediaType.Tv;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export enum OriginCountry {
  De = "DE",
  GB = "GB",
  Us = "US",
}

export enum OriginalLanguage {
  De = "de",
  En = "en",
}

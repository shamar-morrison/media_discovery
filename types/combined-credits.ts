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

export enum OriginCountry {
  De = "DE",
  GB = "GB",
  Us = "US",
}

export enum OriginalLanguage {
  De = "de",
  En = "en",
}

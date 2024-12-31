import { OriginalLanguage } from "@/types/discover-movie";

export interface DiscoverTvShowResponse {
  page: number;
  results: DiscoverTvShowResult[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverTvShowResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: OriginalLanguage;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: Date;
  name: string;
  vote_average: number;
  vote_count: number;
}

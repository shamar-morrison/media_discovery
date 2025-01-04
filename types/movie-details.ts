export interface MovieDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: OriginCountry[];
  original_language: OriginalLanguage;
  original_title: string;
  overview: string | undefined;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: Date | undefined;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  images: Images;
  credits: Credits;
  similar: TSimilar;
}

export interface Credits {
  cast: Cast[];
  crew: Cast[];
}

export interface TSimilar {
  page: number;
  results: SimilarMoviesResult[];
  total_pages: number;
  total_results: number;
}

export interface SimilarMoviesResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Images {
  backdrops: any[];
  logos: any[];
  posters: any[];
}

export enum OriginCountry {
  Us = "US",
}

export enum OriginalLanguage {
  En = "en",
}

export interface ProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: OriginCountry;
}

export interface ProductionCountry {
  iso_3166_1: OriginCountry;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: OriginalLanguage;
  name: string;
}

export interface Videos {
  results: VideosResult[];
}

export interface VideosResult {
  iso_639_1: OriginalLanguage;
  iso_3166_1: OriginCountry;
  name: string;
  key: string;
  site: Site;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: Date;
  id: string;
}

export enum Site {
  YouTube = "YouTube",
}

export enum VideoType {
  Clip = "Clip",
  Featurette = "Featurette",
  Teaser = "Teaser",
  Trailer = "Trailer",
}

import { MediaType } from "@/types/multi-search";

export interface AddToWatchlistProps {
  poster_path: string;
  title: string;
  vote_average: number;
  id: number;
  mediaType: MediaType;
  release_date: Date | undefined;
}

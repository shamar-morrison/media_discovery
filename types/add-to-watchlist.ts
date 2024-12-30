import { MediaType } from "@/types/multi-search";

export interface AddToWatchlistProps {
  posterPath: string;
  title: string;
  rating: number;
  id: number;
  mediaType: MediaType;
  release_date: Date | undefined;
}

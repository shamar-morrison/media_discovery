import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { PopularMoviesResponse } from "@/types/popular-movies";

export function useGetPopularMovies() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["get-popular-movies"],
    queryFn: async () => {
      try {
        const response =
          await axiosInstance.get<PopularMoviesResponse>(`/movie/popular`);
        return response.data;
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        return null;
      }
    },
    notifyOnChangeProps,
  });
}

import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { MovieDetailsResponse } from "@/types/movie-details";

export const useGetMovieDetails = (id: string) => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["movie-details", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get<MovieDetailsResponse>(
          `/movie/${id}?append_to_response=videos,images,credits`,
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    notifyOnChangeProps,
  });
};

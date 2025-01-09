import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { CombinedCreditsResult } from "@/types/combined-credits";
import { PersonDetails } from "@/types/person-details";

export function useGetPersonInfo(personId: number) {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["person-info", personId],
    queryFn: async () => {
      try {
        const [details, credits] = await Promise.all([
          getPersonDetails(personId),
          getPersonCredits(personId),
        ]);
        return {
          credits,
          details,
        };
      } catch (error) {
        console.error("Error fetching person info", error);
        return null;
      }
    },
    notifyOnChangeProps,
  });
}

async function getPersonCredits(personId: number) {
  try {
    const response = await axiosInstance.get<CombinedCreditsResult>(
      `/person/${personId}/combined_credits`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching combined credits:", error);
    return null;
  }
}

async function getPersonDetails(personId: number) {
  try {
    const response = await axiosInstance.get<PersonDetails>(
      `/person/${personId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching person details:", error);
    return null;
  }
}

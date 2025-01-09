import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { tabStyles } from "@/styles/tab-styles";
import { PersonDetailsTab } from "@/components/person-info-tabs/person-details-tab";
import { FilmographyMovies } from "@/components/person-info-tabs/filmography-movies";
import { FilmographyTvShows } from "@/components/person-info-tabs/filmography-tv-shows";
import { TabBarLabel } from "@/components/tab-bar-label";
import { MovieCredits, TvShowCredits } from "@/types/combined-credits";

const Tab = createMaterialTopTabNavigator();

type PersonTabLayoutProps = {
  details: string;
  movies: MovieCredits[];
  tvShows: TvShowCredits[] | undefined;
};

export function PersonTabLayout({
  details,
  movies,
  tvShows,
}: PersonTabLayoutProps) {
  const DetailsWrapper = () => <PersonDetailsTab details={details} />;
  const MoviesWrapper = () => <FilmographyMovies movies={movies} />;
  const TvShowsWrapper = () => <FilmographyTvShows tv={tvShows} />;

  return (
    <Tab.Navigator
      screenOptions={tabStyles}
      initialRouteName={"movies"}
      backBehavior={"none"}
      style={{ flex: 1 }}
    >
      <Tab.Screen
        name={"details"}
        component={DetailsWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Details</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name={"movies"}
        component={MoviesWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>Movies</TabBarLabel>
          ),
        }}
      />
      <Tab.Screen
        name={"tv"}
        component={TvShowsWrapper}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused}>TV Shows</TabBarLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

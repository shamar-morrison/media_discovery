export const isValidWatchlistCSV = (content: string): boolean => {
  try {
    const sections = content.split("\n\n").filter(Boolean);
    if (sections.length === 0) return false;

    for (const section of sections) {
      const [listName, header, ...rows] = section.split("\n").filter(Boolean);

      // Validate list name
      if (!["movies", "tvShows", "watchedEpisodes"].includes(listName))
        return false;

      // Validate header based on section
      if (listName === "watchedEpisodes") {
        if (header !== "showId,showName,seasons,watchedEpisodes") return false;
      } else {
        if (header !== "id,title,poster_path,release_date,vote_average")
          return false;
      }

      // Skip row validation for watched episodes as it's a complex object
      if (listName === "watchedEpisodes") continue;

      // Validate each row for movies and tvShows
      for (const row of rows) {
        const parts = row.split(",");
        if (parts.length !== 5) return false;

        // Check if id is a number
        if (isNaN(parseInt(parts[0]))) return false;

        // Check if vote_average is a number
        if (isNaN(parseFloat(parts[4]))) return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

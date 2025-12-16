const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

async function searchMoviePosters(movieTitle) {
  const response = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: `${process.env.REACT_APP_API_KEY}`,
        query: movieTitle,
        include_adult: false,
      },
    }
  );

  const results = response.data.results;
  if (results.length > 0) {
    const posterPath = results[0].poster_path;
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
  }

  return null;
}

router.get("/movies/:city", async (req, res) => {
  const { city } = req.params;
  try {
    // Make an HTTP GET request to the BookMyShow URL for the selected city
    const response = await axios.get(`https://paytm.com/movies/${city}`);
    const html = response.data;

    // Use cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Extract movie details from the parsed HTML
    const movies = [];

    const moviePromises = [];
    const movieSet = new Set();
    $("a").each((index, element) => {
      const bookingUrl = $(element).attr("href");
      if (bookingUrl && bookingUrl.includes("-movie-detail-")) {
        const matchResult = bookingUrl.match(/movies\/(.+?)-movie/);
        if (matchResult && matchResult[1]) {
          const title = matchResult[1];
          const formattedTitle = title
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          if (!movieSet.has(formattedTitle)) {
            movieSet.add(formattedTitle);

            
            const posterPromise = searchMoviePosters(formattedTitle)
              .then((posterUrl) => {
                movies.push({
                  bookingUrl: `https://paytm.com${bookingUrl}`,
                  title: formattedTitle,
                  posterUrl,
                });
              })
              .catch((error) => {
                console.error("Error searching movie posters:", error);
              });

            moviePromises.push(posterPromise);
          }
        }
      }
    });

    // Wait for all movie promises to resolve
    await Promise.all(moviePromises);

    // Send the movie details as the API response
    res.json({ movies });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching movie listings." });
  }
});

module.exports = router;

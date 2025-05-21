import { Movie } from "@/app/interfaces/movie";
import type { NextApiRequest, NextApiResponse } from "next";
// import Redis from "ioredis";

const API_URL_TITLE = `${process.env.API_PROTOCOL}://${process.env.API_HOST}/shows/search/title?series_granularity=show&output_language=en`;
const API_URL_MOVIE = `${process.env.API_PROTOCOL}://${process.env.API_HOST}/shows/`;
const API_KEY = `${process.env.API_KEY}`;
const API_HOST = `${process.env.API_HOST}`;

// const redis = new Redis(process.env.REDIS_URL || "redis://10.11.10.2:6379");
const COUNTER_KEY = "searchMovies:counter";
const COUNTER_DATE_KEY = "searchMovies:counter:date";
const LIMIT = 500;

export default async function searchMovies(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { title, cursor } = req.query;
  res.setHeader('Access-Control-Allow-Credentials', 1)
  res.setHeader('Access-Control-Allow-Origin', '*') // Allows all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (
    !API_URL_TITLE ||
    !API_HOST ||
    !API_URL_MOVIE ||
    !API_URL_MOVIE ||
    !API_KEY
  ) {
    return res.status(500).json({ error: "Missing API configuration" });
  }

  if (!title) {
    return res.status(400).json({ error: "Movie title is required" });
  }

  // --- Deactivated Redis-based daily counter ---
  // const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  // const lastDate = await redis.get(COUNTER_DATE_KEY);
  // if (lastDate !== today) {
  //   await redis.set(COUNTER_DATE_KEY, today);
  //   await redis.set(COUNTER_KEY, 0);
  // }
  // const count = await redis.incr(COUNTER_KEY);
  // if (count > LIMIT) {
  //   return res.status(429).json({ error: "Daily request limit reached" });
  // }

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": API_HOST,
      "X-RapidAPI-Key": API_KEY,
    },
  };

  try {
    const titleResponse = await fetch(
      `${API_URL_TITLE}&country=us&title=${encodeURIComponent(
        title as string,
      )}${cursor ? `&cursor=${encodeURIComponent(cursor as string)}` : ""}`,
      options,
    );
    const titleResponseData = await titleResponse.json();

    if (titleResponseData[0].id) {
      const response = await fetch(
        `${API_URL_MOVIE}${titleResponseData[0].id}?series_granularity=episode&output_language=en`,
        options,
      );

      const data: Movie = await response.json();

      return res.status(200).json({
        movie: data ?? [],
      });
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
}

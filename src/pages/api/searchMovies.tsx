import { Movie } from '@/app/interfaces/movie';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL_TITLE = `${process.env.API_PROTOCOL}://${process.env.API_HOST}/${process.env.API_URL_SEARCH}?series_granularity=show&output_language=en`;
const API_URL_MOVIE = `${process.env.API_PROTOCOL}://${process.env.API_HOST}/${process.env.API_URL_MOVIE}`;
const API_KEY = `${process.env.API_KEY}`;
const API_HOST = `${process.env.API_HOST}`;

export default async function searchMovies(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { title, cursor } = req.query;

	if (!title) {
		return res.status(400).json({ error: 'Movie title is required' });
	}

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Host': API_HOST,
			'X-RapidAPI-Key': API_KEY,
		},
	};

	try {
		const titleResponse = await fetch(
			`${API_URL_TITLE}&country=us&title=${encodeURIComponent(
				title as string
			)}${cursor ? `&cursor=${encodeURIComponent(cursor as string)}` : ''}`,
			options
		);
		const titleResponseData = await titleResponse.json();

		if (titleResponseData[0].id) {
			const response = await fetch(
				`${API_URL_MOVIE}${titleResponseData[0].id}?series_granularity=episode&output_language=en`,
				options
			);

			const data: Movie = await response.json();

			return res.status(200).json({
				movie: data ?? [],
			});
		}
	} catch (error) {
		console.error('Error fetching movies:', error);
		return res.status(500).json({ error: 'Failed to fetch movies' });
	}
}
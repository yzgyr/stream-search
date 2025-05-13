"use client";

import { Movie } from '@/app/interfaces/movie';
import React, { useState } from 'react';
import { convertMinutesToHoursMinutes } from '@/app/utils/tools';
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Mapping of country abbreviations to full country names
const countryNames: { [key: string]: string } = {
    us: 'United States',
    de: 'Germany',
    fr: 'France',
    gb: 'United Kingdom',
    jp: 'Japan',
    at: 'Austria',
    it: 'Italy',
    nl: 'Netherlands',
    // Add more country mappings as needed
};

interface MovieListProps {
    movie: Movie;
    type: 'all' | 'subscription' | 'rent' | 'buy';
}

const MovieList: React.FC<MovieListProps> = ({ movie, type }: MovieListProps) => {
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0); // Track the currently displayed country

    if (!movie) {
        return <Typography variant="h6" color="textSecondary">No movie data available</Typography>;
    }

    const countries = Object.entries(movie.streamingOptions); // Get all countries and their options
    const currentCountry = countries[currentCountryIndex]; // Get the currently displayed country

    const handleNextCountry = () => {
        setCurrentCountryIndex((prevIndex) => (prevIndex + 1) % countries.length); // Move to the next country
    };

    const handlePreviousCountry = () => {
        setCurrentCountryIndex((prevIndex) => (prevIndex - 1 + countries.length) % countries.length); // Move to the previous country
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {/* Main Section */}
            <Box sx={{ flexGrow: 1 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                    {movie.imageSet.verticalPoster.w240 ? (
                        <CardMedia
                            component="img"
                            sx={{
                                width: '100%',
                                height: 300,
                                objectFit: 'contain', // Ensures the image maintains its aspect ratio
                            }}
                            image={movie.imageSet.verticalPoster.w240}
                            alt={movie.title}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: '100%',
                                height: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                                color: '#888',
                                fontSize: '0.8rem',
                            }}
                        >
                            No Poster Available
                        </Box>
                    )}
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {movie.title.replace(/#/g, '')} ({movie.releaseYear})
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>ID:</strong> {movie.id}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Original Title:</strong> {movie.originalTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Rating:</strong> {movie.rating}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Runtime:</strong> {convertMinutesToHoursMinutes(movie.runtime)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Country Section */}
            <Box
                sx={{
                    width: 300, // Fixed width for the country section
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 1,
                    boxShadow: 2,
                }}
            >
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Streaming Options:</strong>
                    </Typography>
                    {currentCountry && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: '#f9f9f9',
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                <strong>Country:</strong> {countryNames[currentCountry[0]] || currentCountry[0].toUpperCase()}
                            </Typography>
                            {currentCountry[1].map((option, optionIndex) => (
                                (type === 'all' || option.type === type) && (
                                    <Box key={optionIndex} sx={{ mt: 1, pl: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Service:</strong> {option.service.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Quality:</strong> {option.quality}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Type:</strong> {option.type}
                                            {option.type === 'buy' && (
                                                <> ({option.price.formatted})</>
                                            )}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            href={option.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Visit Link
                                        </Button>
                                    </Box>
                                )
                            ))}
                        </Box>
                    )}
                </Box>
                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <IconButton onClick={handlePreviousCountry} disabled={countries.length <= 1}>
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton onClick={handleNextCountry} disabled={countries.length <= 1}>
                        <ArrowDownwardIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default MovieList;

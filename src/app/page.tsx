"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import MovieList from "@/app/components/MovieList";
import { Movie } from "@/app/interfaces/movie";

const Home = () => {
  const [movie, setMovie] = useState<Movie>();
  const [cursor, setCursor] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [type, setType] = useState("subscription");

  const fetchMovies = async (title: string, isNewSearch: boolean = false) => {
    if (!title) {
        return;
    }
    if (isNewSearch) {
      setCursor(null); // Reset the cursor for a new search
    }

    const response = await fetch(
      `/api/searchMovies?title=${encodeURIComponent(title)}&country=us${cursor && !isNewSearch ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
    );
    const data = await response.json();

    setMovie(data.movie);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Movie Search
      </Typography>
      <Box sx={{ mt: 3 }}>
        {/* <FormControl fullWidth> */}
        <InputLabel id="country-select-label">Select Stream Type</InputLabel>
        <Select
          labelId="country-select-label"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="subscription">Free</MenuItem>
          <MenuItem value="rent">Rent</MenuItem>
          <MenuItem value="buy">Buy</MenuItem>
        </Select>
        {/* </FormControl> */}
        {/* </Box> */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}> */}
        <TextField
          label="Search Movies"
          variant="outlined"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchMovies(searchString, true)}
        >
          Search
        </Button>
      </Box>
      {movie && <MovieList movie={movie} type={type} />}
    </Container>
  );
};

export default Home;

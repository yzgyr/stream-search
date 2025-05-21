import React, { useState } from "react";
import { countryList } from "./countryList";

interface MovieSearchFormProps {
  onSearch: (title: string, country: string) => void;
}

const MovieSearchForm: React.FC<MovieSearchFormProps> = ({ onSearch }) => {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("us");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title.trim()) {
      onSearch(title, country);
      setTitle("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter movie title"
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      >
        {countryList
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
      </select>
      <button type="submit" style={{ padding: "10px 20px" }}>
        Search
      </button>
    </form>
  );
};

export default MovieSearchForm;

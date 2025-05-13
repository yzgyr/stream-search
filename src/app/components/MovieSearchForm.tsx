import React, { useState } from "react";

interface MovieSearchFormProps {
  onSearch: (title: string) => void;
}

const MovieSearchForm: React.FC<MovieSearchFormProps> = ({ onSearch }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title.trim() === "") {
      onSearch("Tomorrow War");
    }
    if (title.trim()) {
      onSearch(title);
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
      <button type="submit" style={{ padding: "10px 20px" }}>
        Search
      </button>
    </form>
  );
};

export default MovieSearchForm;

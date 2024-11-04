import React, { useState } from 'react';
import axios from 'axios';
import Garment from './Garment';

const API_URL = process.env.REACT_APP_API_URL;

const GarmentSearch = () => {
  const [query, setQuery] = useState('');
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/garments/search?query=${query}`);
      setGarments(response.data);
    } catch (err) {
      setError('An error occurred while searching for garments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Garment Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for garments..."
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && garments.length === 0 && <p>No results found.</p>}
      <ul>
        {garments.map((garment) => (
          <Garment garment={garment} />
        ))}
      </ul>
    </div>
  );
}

export default GarmentSearch;

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function GarmentSearch() {
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
          <li key={garment.id}>
            <h3>{garment.title}</h3>
            <p>Brand: {garment.brand}</p>
            <p>Price: {garment.price} {garment.currency}</p>
            <p>Discounted Price: {garment.discountedPrice} {garment.currency}</p>
            {garment.imageUrl && <img src={garment.imageUrl} alt={garment.title} style={{ maxWidth: '200px' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GarmentSearch;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onAddCity: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddCity }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const cachedSuggestions = localStorage.getItem(`suggestions_${query.toLowerCase()}`);
      if (cachedSuggestions) {
        setSuggestions(JSON.parse(cachedSuggestions));
        return;
      }

      setIsFetching(true);
      setError(null); 

      try {
        const response = await fetchCitySuggestions(query);
        if (response.data.length === 0) {
          setError('City not found');
          setSuggestions([]);
        } else {
          const cityNames = response.data.map((location: any) => location.name);
          setSuggestions(cityNames);
          localStorage.setItem(`suggestions_${query.toLowerCase()}`, JSON.stringify(cityNames));
        }
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsFetching(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSuggestions();
    }, 500); 

    return () => clearTimeout(debounceFetch);
  }, [query]);

  const fetchCitySuggestions = (query: string) => {
    return axios.get(
      `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${query}`
    );
  };

  const handleSelectCity = (city: string) => {
    setQuery('');
    setSuggestions([]);
    setError(null); 
    onAddCity(formatCityName(city));
  };

  const handleSubmit = () => {
    if (query.trim() && !isFetching) {
      const formattedQuery = formatCityName(query.trim());
      if (suggestions.includes(formattedQuery)) {
        onAddCity(formattedQuery);
        setQuery('');
        setSuggestions([]);
        setError(null);
      } else {
        setError('City not found');
      }
    }
  };

  const formatCityName = (city: string) => {
    return city
      .split(/([-\s])/g)
      .map((part) => ([' ', '-'].includes(part) ? part : capitalizeFirstLetter(part)))
      .join('');
  };

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className={styles.input}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>
      {isFetching && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.suggestions}>
        {suggestions.map((city) => (
          <li key={city} onClick={() => handleSelectCity(city)} className={styles.suggestion}>
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
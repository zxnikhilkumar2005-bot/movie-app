import { useState, useCallback, useRef } from 'react';
import { searchMoviesApi } from '../utils/api';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = useCallback(async (query, page = 1, filters = { type: '', year: '' }) => {
    if (!query || !query.trim()) {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      return;
    }

    const isNewSearch = page === 1;
    
    if (isNewSearch) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
      setError(null);
    }

    try {
      const { results, totalResults: total } = await searchMoviesApi(query, page, filters.type, filters.year);
      
      setMovies(prev => {
        // Prevent pure duplicates from OMDB pagination quirks
        const combined = isNewSearch ? results : [...prev, ...results];
        const unique = Array.from(new Map(combined.map(m => [m.imdbID, m])).values());
        return unique;
      });
      setTotalResults(total);
      
      if (isNewSearch && results.length === 0) {
        setError("No movies found for your search.");
      }
    } catch (err) {
      if (isNewSearch) {
        setMovies([]);
        setTotalResults(0);
      }
      setError(err.message);
    } finally {
       setLoading(false);
       setLoadingMore(false);
    }
  }, []);

  return { movies, loading, loadingMore, error, totalResults, searchMovies, setMovies };
};

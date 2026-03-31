import { useState, useEffect } from 'react';
import { searchMoviesApi } from '../utils/api';

export const useCategoryMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategory = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      try {
        const { results } = await searchMoviesApi(query, 1);
        if (isMounted) {
          // Filter out results without an ID or valid poster to ensure high quality
          const valid = results.filter(m => m.Poster !== 'N/A' && m.imdbID);
          setMovies(valid);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch category movies.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategory();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { movies, loading, error };
};

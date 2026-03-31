import { useState, useEffect } from 'react';
import { getMovieDetailsApi } from '../utils/api';

const HERO_MOVIE_IDS = [
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt0468569', // The Dark Knight
  'tt0499549', // Avatar
  'tt0120338', // Titanic
  'tt2802144', // John Wick
  'tt0133093'  // The Matrix
];

export const useHeroMovies = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const promises = HERO_MOVIE_IDS.map(id => getMovieDetailsApi(id));
        const results = await Promise.all(promises);
        
        if (isMounted) {
          // Filter out any failed requests or empty responses just in case
          const validMovies = results.filter(movie => movie && movie.Response !== 'False');
          setHeroMovies(validMovies);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch hero movies.');
          console.error('Error fetching hero movies:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  return { heroMovies, loading, error };
};

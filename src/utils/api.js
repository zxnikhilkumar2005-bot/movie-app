import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim();
const BASE_URL = 'https://www.omdbapi.com/';

const client = axios.create({
  baseURL: BASE_URL,
  params: { apikey: API_KEY }
});

export const searchMoviesApi = async (query, page = 1, type = '', year = '') => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API Key is missing or invalid.');
  }

  const params = { s: query, page };
  if (type) params.type = type;
  if (year) params.y = year;

  try {
    const res = await client.get('', { params });
    
    if (res.data.Response === 'False') {
      throw new Error(res.data.Error || 'No results found.');
    }

    return {
      results: res.data.Search || [],
      totalResults: parseInt(res.data.totalResults || '0', 10)
    };
  } catch (error) {
     if (error.response?.status === 401) {
       throw new Error('Invalid or Inactive API Key.');
     }
     throw new Error(error.response?.data?.Error || error.message || 'Failed to fetch movies.');
  }
};

export const getMovieDetailsApi = async (id) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API Key is missing.');
  }

  try {
    const res = await client.get('', { params: { i: id, plot: 'full' } });
    
    if (res.data.Response === 'False') {
      throw new Error(res.data.Error || 'Details not found.');
    }

    return res.data;
  } catch (error) {
     if (error.response?.status === 401) throw new Error('Invalid API Key.');
     throw new Error('Failed to fetch movie details.');
  }
};

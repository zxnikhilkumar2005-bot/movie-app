import axios from 'axios';

/**
 * Clean reusable utility function to extract a direct YouTube Video ID
 * using a search query.
 * 
 * We use a public CORS proxy (corsproxy.io) to fetch the raw HTML of 
 * a YouTube search page, then extract the first valid video ID.
 */
export const fetchTrailerVideoId = async (movieTitle, year) => {
  const query = encodeURIComponent(`${movieTitle} ${year} official trailer`);
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${query}`;
  
  // CORS Proxy to bypass browser restrictions
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(ytSearchUrl)}`;

  try {
    const response = await axios.get(proxyUrl);
    const html = response.data;
    
    // Attempt 1: Look for "videoId":"XXXXXXXXXXX" which is the standard Next.js payload format on YouTube
    const videoIdMatch = html.match(/"videoId":"([^"]{11})"/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }
    
    // Attempt 2: Fallback regex looking for watch?v= parameter
    const watchMatch = html.match(/\/watch\?v=([^"&?]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to extract YouTube Trailer ID:', error);
    return null; // Return null gracefully instead of crashing
  }
};

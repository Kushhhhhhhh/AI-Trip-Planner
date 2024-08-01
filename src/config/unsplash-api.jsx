import axios from 'axios';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export const searchPhotos = async (query) => {
  try {
    const response = await unsplashApi.get('/search/photos', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching photos from Unsplash', error);
    return [];
  }
};
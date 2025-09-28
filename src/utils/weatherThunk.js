import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather } from './fetchWeather';

const CACHE_LIFETIME_MS = 60 * 60 * 1000; // 1 hour
const getLocationKey = (location) => `${location.latitude},${location.longitude}`;

export const fetchAndStoreWeather = createAsyncThunk(
  'weather/fetchAndStore',
  async (location, { getState, rejectWithValue }) => {
    if (!location) {
      return rejectWithValue({ error: 'Location not provided.', location: null });
    }

    const locationKey = getLocationKey(location);
    const weatherState = getState().weather[locationKey];
    const now = Date.now();

    if (weatherState) {
      if (weatherState.status === 'pending') {
        return;
      }
      
      const isFresh = now - weatherState.lastFetched < CACHE_LIFETIME_MS;
      if (isFresh && weatherState.status === 'fulfilled') {
        return { weatherData: weatherState.data, location }; 
      }
    }

    try {
      const weatherData = await fetchWeather(location);
      return { weatherData, location };
    } catch (error) {
      return rejectWithValue({ error: error.message, location });
    }
  }
);
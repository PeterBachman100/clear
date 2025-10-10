import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather } from './fetchWeather'; 
import { ensureLocationEntry } from '../components/WeatherSlice';

const CACHE_LIFETIME_MS = 60 * 60 * 1000; // 1 hour

export const getWeather = createAsyncThunk(
    'weather/getWeather',
    async (locationId, { dispatch, getState, rejectWithValue }) => {
    
        if (!locationId) {
        return rejectWithValue({ error: 'locationId not provided' });
        }

        const state = getState();
        const location = state.dashboard.locations[locationId];
        const weatherState = state.weather[locationId];
        const now = Date.now();

        // --- ENSURE ENTRY ----
        dispatch(ensureLocationEntry(locationId));
        
        // --- CACHE CHECK ---
        if (weatherState) {
            if (weatherState.status === 'pending') {
                return; 
            }

            const isFresh = now - weatherState.lastFetched < CACHE_LIFETIME_MS;
            if (isFresh && weatherState.status === 'fulfilled') {
                return { weatherData: weatherState.data, locationId }; 
            }
        }
        
        // --- FETCH ---
        try {
            const weatherData = await fetchWeather(location); 
            return { weatherData, location };
        } catch (error) {
            throw error; 
        }
    }
);
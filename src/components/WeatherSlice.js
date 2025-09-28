import { createSlice } from '@reduxjs/toolkit'
import { fetchAndStoreWeather } from '../utils/weatherThunk';

const initialState = {};

const getLocationKey = (location) => `${location?.latitude},${location?.longitude}`;

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndStoreWeather.pending, (state, action) => {
        const { location } = action.meta.arg;
        const locationKey = getLocationKey(location);
        state[locationKey] = {
          data: state[locationKey]?.data || null,
          status: 'pending',
          lastFetched: state[locationKey]?.lastFetched || null,
          error: null,
        };
      })
      .addCase(fetchAndStoreWeather.fulfilled, (state, action) => {
        const { weatherData, location } = action.payload;
        const locationKey = getLocationKey(location);
        state[locationKey] = {
          data: weatherData,
          status: 'fulfilled',
          lastFetched: Date.now(),
          error: null,
        };
      })
      .addCase(fetchAndStoreWeather.rejected, (state, action) => {
        const { location } = action.meta.arg;
        const locationKey = getLocationKey(location);
        state[locationKey] = {
          data: state[locationKey]?.data || null,
          status: 'rejected',
          lastFetched: state[locationKey]?.lastFetched || null,
          error: action.error.message,
        };
      });
  },
});

export const { storeWeather } = weatherSlice.actions;

export default weatherSlice.reducer;



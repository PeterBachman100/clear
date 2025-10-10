import { createSlice } from '@reduxjs/toolkit'
import { getWeather } from '../utils/weatherThunk';

const initialState = {};

const getLocationKey = (location) => `${location?.latitude},${location?.longitude}`;

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    ensureLocationEntry: (state, action) => {
      const locationId = action.payload;
      if (state[locationId]) {
        return;
      }
      state[locationId] = {
        data: null,
        status: 'initial',
        lastFetched: null,
        error: null,
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state, action) => {
        const { location } = action.meta.arg;
        const locationKey = getLocationKey(location);
        state[locationKey] = {
          data: state[locationKey]?.data || null,
          status: 'pending',
          lastFetched: state[locationKey]?.lastFetched || null,
          error: null,
        };
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        const { weatherData, location } = action.payload;
        const locationKey = getLocationKey(location);
        state[locationKey] = {
          data: weatherData,
          status: 'fulfilled',
          lastFetched: Date.now(),
          error: null,
        };
      })
      .addCase(getWeather.rejected, (state, action) => {
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

export const { ensureLocationEntry } = weatherSlice.actions;

export default weatherSlice.reducer;



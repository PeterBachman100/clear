import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

const getLocationKey = () => `${location.latitude},${location.longitude}`;

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    fetchPending: (state, action) => {
        const { location } = action.payload;
        const locationKey = getLocationKey(location);

        state[locationKey] = {
            data: state[locationKey]?.data || null,
            status: 'loading',
            lastFetched: state[locationKey]?.lastFetched || null,
            error: null,
        };
    },

    fetchSucceeded: (state, action) => {
        const {location, weatherData} = action.payload;
        const locationKey = getLocationKey(location);

        state[locationKey] = {
            data: weatherData,
            status: 'succeeded',
            lastFetched: Date.npw(),
            error: null,
        };
    },

    fetchFailed: (state, action) => {
        const { location, error } = action.payload;
        const locationKey = getLocationKey(location);

        state[locationKey] = {
            data: state[locationKey]?.data || null,
            status: 'failed',
            lastFetched: state[locationKey]?.lastFetched || null,
            error: error.message,
        };
    },

  },
});

export const { fetchPending, fetchSucceeded, fetchFailed } = weatherSlice.actions;

export default weatherSlice.reducer;
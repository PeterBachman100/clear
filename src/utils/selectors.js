import { createSelector } from '@reduxjs/toolkit';

const getWeatherSlice = (state) => state.weather;
const getLocationId = (state, locationId) => locationId;

export const selectWeatherByLocation = createSelector(
  [getWeatherSlice, getLocationId],
  (weatherSlice, locationId) => {
    return weatherSlice[locationId] || null;
  }
);

export const selectPages = (state) => state.dashboard.pages;
export const selectActivePageId = (state) => state.dashboard.activePageId;

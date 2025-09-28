import { createSelector } from '@reduxjs/toolkit';

export const getWeatherState = (state) => state.weather;

const getLocationKey = (location) => {
    if (!location) return null;
    return `${location.latitude},${location.longitude}`;
};

export const selectWeatherByLocation = createSelector(
  [getWeatherState, (state, location) => location],
  (weatherState, location) => {
    const locationKey = getLocationKey(location);
    if (!locationKey) return null;
    return weatherState[locationKey] || null;
  }
);

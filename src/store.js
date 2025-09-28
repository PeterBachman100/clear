import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './components/DashboardSlice';
import weatherReducer from './components/WeatherSlice';

export const store = configureStore({
  reducer: {
   dashboard: dashboardReducer,
   weather: weatherReducer,
  },
});
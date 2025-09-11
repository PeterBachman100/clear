import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './components/DashboardSlice';

export const store = configureStore({
  reducer: {
   dashboard: dashboardReducer,
  },
});
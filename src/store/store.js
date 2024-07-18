import { configureStore } from '@reduxjs/toolkit';
import regionOfInterestReducer from './slices/regionOfInterestSlice';

export const store = configureStore({
  reducer: {
    regionOfInterest: regionOfInterestReducer,
  },
})
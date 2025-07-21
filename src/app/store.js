import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from '@/features/loading/loadingSlice';
import loggedInReduer from '@/features/loggedIn/loggedInSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    loggedIn: loggedInReduer,
  },
});

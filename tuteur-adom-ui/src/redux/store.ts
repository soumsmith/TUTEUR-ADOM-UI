// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice'; // Ajoutez cette ligne

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer, // Ajoutez cette ligne
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
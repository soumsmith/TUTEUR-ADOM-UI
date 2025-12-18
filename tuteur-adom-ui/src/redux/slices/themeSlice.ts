// redux/slices/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit';

// Vérifie le thème stocké dans localStorage ou utilise la préférence système
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Vérifie la préférence système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

// Applique le thème initial au chargement
const applyInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const theme = getInitialTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Applique le thème dès le chargement du module
applyInitialTheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
      // Sauvegarde dans localStorage et applique au DOM
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newMode);
        if (newMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
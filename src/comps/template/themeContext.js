import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const ThemeContext = createContext();

// Custom Hook to use Theme
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Retrieve the theme from localStorage or default to 'dark'
  const storedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(storedTheme || 'dark');

  // Effect to persist theme change in localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'originalDark');
  const themeOptions = [
    { label: "Original", value: "original" },
    { label: "Majestic", value: "majestic" },
    { label: "Minimal", value: "minimal" },
    { label: "Retro", value: "retro" },
  ];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const switchTheme = () => {
    const isDark = theme.endsWith('Dark');
    const base = theme.replace(/(Dark|Light)$/, '');
    setTheme(`${base}${isDark ? 'Light' : 'Dark'}`);
  };

const renderThemesOptions = () => {
  return <div className="theme-selector-container">
          <select 
            className="theme-selector"
            aria-label="Select theme"
            value={theme.replace(/(Dark|Light)$/, '')} 
            onChange={(e) => {
              const base = e.target.value;
              const isDark = theme.endsWith('Dark');
              setTheme(`${base}${isDark ? 'Dark' : 'Light'}`);
            }}>
            {themeOptions.map(({ label, value }) => (
              <option key={value} value={value} className="theme-option">
                {label} {theme.endsWith('Dark') ? '🌙' : '☀️'}
              </option>
            ))}
          </select>
      <div className="theme-selector-icon">🎨</div>
    </div>
};

  return (
    <ThemeContext.Provider value={{ theme, setTheme, switchTheme, renderThemesOptions }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

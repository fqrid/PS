// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
const savedMode = localStorage.getItem('darkMode') === 'true';
setDarkMode(savedMode);
document.body.classList.toggle('modo-oscuro', savedMode);
}, []);

useEffect(() => {
localStorage.setItem('darkMode', darkMode);
document.body.classList.toggle('modo-oscuro', darkMode);
}, [darkMode]);

const toggleDarkMode = () => {
setDarkMode((prev) => !prev);
};

return (
<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
{children}
</ThemeContext.Provider>
);
};

export const useTheme = () => useContext(ThemeContext);
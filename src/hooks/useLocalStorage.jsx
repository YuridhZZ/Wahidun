import { useState, useEffect } from 'react';

function getStoredValue(key, initialValue) {
  try {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      return JSON.parse(savedValue);
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return initialValue;
  }
}

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getStoredValue(key, initialValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
};
import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to persist chat messages in sessionStorage.
 * Data persists on page refresh but is cleared when the tab is closed.
 */
export function useChatSession<T>(key: string, initialValue: T) {
  // Initialize state from sessionStorage
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from sessionStorage', error);
      return initialValue;
    }
  });

  // Sync state changes to sessionStorage
  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to sessionStorage', error);
    }
  }, [key, value]);

  // Function to clear chat history manually (e.g. for a "Reset Chat" button)
  const clearSession = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Error clearing sessionStorage', error);
    }
  }, [key, initialValue]);

  return [value, setValue, clearSession] as const;
}
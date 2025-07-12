import { useState, useEffect } from 'react';

function useFetch(url) {
  // State to track all aspects of the API call
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Don't fetch if no URL provided
    if (!url) return;
    
    const fetchData = async () => {
      try {
        // Start loading, clear previous error
        setLoading(true);
        setError(null);
        
        // Make the API call
        const response = await fetch(url);
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const result = await response.json();
        const resultString = JSON.stringify(result)
        setData(resultString);
        
      } catch (err) {
        // Handle any errors that occurred
        setError(err.message);
        setData(null);
      } finally {
        // Always stop loading, whether success or error
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]); // Re-fetch when URL changes
  
  // Return everything the component needs
  return { data, loading, error };
}

export default useFetch
import { useState, useEffect } from 'react';

function useFetch(url,method='GET',userData) {
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
        if(method==='GET'||method==='DELETE'){
          const response = await fetch(url,{
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        else{
          const response = await fetch(url,{
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
        }
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const result = await response.json();
        setData(result);
        
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
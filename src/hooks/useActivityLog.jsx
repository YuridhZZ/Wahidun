import { useState, useCallback } from 'react';

const ACTIVITY_LOG_KEY = 'activityLog';

export const useActivityLog = () => {
  const getLogs = () => {
    try {
      const logs = sessionStorage.getItem(ACTIVITY_LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error("Error reading activity log from sessionStorage", error);
      return [];
    }
  };

  const [activities, setActivities] = useState(getLogs);

  const logActivity = useCallback((action) => {
    const newActivity = {
      action,
      timestamp: new Date().toISOString(),
    };
    
    const updatedActivities = [newActivity, ...getLogs()];
    
    sessionStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
  }, []);

  // 👇 This new function clears the log
  const clearActivityLog = useCallback(() => {
    sessionStorage.removeItem(ACTIVITY_LOG_KEY);
    setActivities([]);
  }, []);

  return { activities, logActivity, clearActivityLog }; // Export the new function
};
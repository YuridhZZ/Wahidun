import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LOCAL_STORAGE_KEY = 'userActivityLogs';

export const useActivityLog = () => {
  const { user } = useAuth();

  const getUserSpecificLogs = useCallback(() => {
    if (!user?.id) return [];
    try {
      const allLogs = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedLogs = allLogs ? JSON.parse(allLogs) : {};
      return parsedLogs[user.id] || [];
    } catch (error) {
      console.error("Error reading activity log from localStorage", error);
      return [];
    }
  }, [user]);

  const [activities, setActivities] = useState(getUserSpecificLogs);
  
  useEffect(() => {
      setActivities(getUserSpecificLogs());
  }, [user, getUserSpecificLogs]);

  const logActivity = useCallback((action) => {
    if (!user?.id) return;

    const newActivity = {
      action,
      timestamp: new Date().toISOString(),
    };

    const allLogs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const userLogs = allLogs[user.id] || [];
    const updatedUserLogs = [newActivity, ...userLogs];
    allLogs[user.id] = updatedUserLogs;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allLogs));
    
    setActivities(updatedUserLogs);
  }, [user]);

  return { activities, logActivity };
};
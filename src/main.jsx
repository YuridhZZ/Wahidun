import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initDB } from './utils/indexedDB'; // 1. Import the initializer

// 2. Initialize the database as soon as the app loads
initDB().then(() => {
  console.log("Database initialized successfully.");
  
  // 3. Render the app only AFTER the DB is ready
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

}).catch(err => {
  console.error("Failed to initialize database:", err);
  // Optional: You could render an error message to the user here
});
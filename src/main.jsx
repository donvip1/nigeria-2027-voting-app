/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           React application entry point for the Nigeria 2027 virtual voting app.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added startup wiring for React, the root App component, and global styles.
*********************************************************/

// ========================================================
// Imports and React bootstrap setup
// ========================================================
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// ========================================================
// Render the app into the browser page
// ========================================================
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

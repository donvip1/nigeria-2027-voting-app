/*********************************************************
 Author:                Philip Awazie Donvip
 Year Created:          2026
 Description:           Vite configuration for the Nigeria 2027 virtual voting frontend.
 Modified By:           Philip Awazie Donvip
 Modified Date:         2026-06-07
 Modification Notes:    Added React plugin setup and fixed local development server port.
*********************************************************/

// ========================================================
// Imports and Vite plugin setup
// ========================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ========================================================
// Vite configuration export
// ========================================================
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});

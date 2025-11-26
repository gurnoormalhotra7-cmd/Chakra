import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// auto-register PWA service worker (provided by vite-plugin-pwa)
import 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

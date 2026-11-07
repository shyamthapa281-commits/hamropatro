import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker immediately with automatic background update checks
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Shubha Patro App update available.');
  },
  onOfflineReady() {
    console.log('Shubha Patro App is ready to work completely offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

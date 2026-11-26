import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import logoBadge from './assets/logo-badge.png?inline';

// Favicon from the bundled logo (works in the single-file build too)
const icon = document.querySelector<HTMLLinkElement>('link[rel=icon]');
if (icon) icon.href = logoBadge;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

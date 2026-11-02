import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/alfa-slab-one/latin-400.css';
import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import './styles.css';
import App from './App';
import { installViewportFix } from './viewportFix';

installViewportFix();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { syncColorScheme } from '../scheme';
import { Landing } from './Landing';
import '../brand.css';
import './landing.css';

syncColorScheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
);

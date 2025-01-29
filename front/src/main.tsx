import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import { AuthProvider } from '@services/auth/auth.provider.tsx';

import { App } from './App.tsx'
import './assets/styles/index.scss'

const rootElement = document.getElementById("root");
if (! rootElement) { throw new Error("No root element found in index.html"); }

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

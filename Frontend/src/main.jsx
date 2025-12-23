import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global API Configuration
window.API_BASE_URL = import.meta.env.VITE_API_URL || window.API_BASE_URL + "";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

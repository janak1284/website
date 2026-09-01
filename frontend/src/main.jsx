import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster toastOptions={{
        style: {
          background: 'rgba(19, 13, 38, 0.8)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }
      }} position="top-right" />
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

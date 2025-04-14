import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.supabase' // Using the Supabase version of App
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
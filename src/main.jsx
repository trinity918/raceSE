import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found!");
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
        <ToastContainer position='top-center' />
      </React.StrictMode>
    );
  }
} catch (error) {
  console.error("Error rendering app:", error);
}
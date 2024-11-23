import React from 'react';
import ReactDOM from 'react-dom/client'; // Pastikan Anda menggunakan React 18
import { ApolloClientProvider } from './ApolloClient';
import App from './App';
import './style/tailwind.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloClientProvider>
      <App />
    </ApolloClientProvider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StockProvider } from './context/context';
import { ErrorBoundary } from './component/Error-Boundary';
import FullPageErrorFallback from './component/FullPageFallBack';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary fallbackRender={FullPageErrorFallback}>
      <StockProvider>
         <App />
      </StockProvider>
  </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


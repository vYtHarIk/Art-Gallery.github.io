import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';

console.log('index.js работает');

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('root создан');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App отрендерен');
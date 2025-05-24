// src/index.js
import 'regenerator-runtime';
import './styles/style.css';
import './styles/home.css';
import './styles/profile.css';
import './styles/history.css';
import App from './scripts/app';
import SliderComponent from './scripts/pages/slider';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(error => {
        console.log('SW registration failed: ', error);
      });
  });
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slider
  SliderComponent.init();

  // Initialize main app
  const app = new App({
    content: document.querySelector('main'),
  });

  app.init();
});
import 'regenerator-runtime';
import './styles/style.css';
import './styles/home.css';
import './styles/profile.css';
import './styles/history.css';
import './styles/add-meal.css';
import App from './scripts/app';
import SliderComponent from './scripts/pages/slider';
import AuthGuard from './scripts/utils/auth-guard';

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

document.addEventListener('DOMContentLoaded', () => {
  if (!AuthGuard.isAuthenticated() && !window.location.hash.includes('signin') && !window.location.hash.includes('signup')) {
    window.location.hash = '#/signin';
  }

  SliderComponent.init();

  const app = new App({
    content: document.querySelector('main'),
  });

  app.init();
});
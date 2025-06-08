import 'regenerator-runtime';
import './styles/style.css';
import './styles/home.css';
import './styles/profile.css';
import './styles/history.css';
import './styles/add-meal.css';
import './styles/meal-popup.css';
import './styles/meal-plan.css';
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

document.addEventListener('DOMContentLoaded', async () => {
  // Verify token if user has one
  if (AuthGuard.isAuthenticated()) {
    const isValidToken = await AuthGuard.verifyToken();
    
    if (!isValidToken) {
      // Token is invalid, logout user
      console.log('Token is invalid, logging out...');
      AuthGuard.logout();
      return; // Exit early as logout will redirect
    }
  }
  
  // If not authenticated and not on auth pages, redirect to signin
  if (!AuthGuard.isAuthenticated() && 
      !window.location.hash.includes('signin') && 
      !window.location.hash.includes('signup')) {
    window.location.hash = '#/signin';
  }

  SliderComponent.init();

  const app = new App({
    content: document.querySelector('main'),
  });

  app.init();
});
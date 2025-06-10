import 'regenerator-runtime';
import './styles/home.css';
import './styles/add-meal.css';
import './styles/meal-popup.css';
import './styles/meal-plan.css';
import App from './scripts/app';
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

function toggleHeaderFooter() {
  const url = window.location.hash.slice(1);
  const authRoutes = ['/signin', '/signup', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(url);
  
  const header = document.querySelector('header');
  
  if (header) {
    header.style.display = isAuthRoute ? 'none' : 'block';
  }
  
  document.body.classList.toggle('auth-page', isAuthRoute);
  document.body.classList.toggle('main-page', !isAuthRoute);
}

document.addEventListener('DOMContentLoaded', async () => {
  if (AuthGuard.isAuthenticated()) {
    const isValidToken = await AuthGuard.verifyToken();
    
    if (!isValidToken) {
      console.log('Token is invalid, logging out...');
      AuthGuard.logout();
      return;
    }
  }
  
  if (!AuthGuard.isAuthenticated() && 
      !window.location.hash.includes('signin') && 
      !window.location.hash.includes('signup')) {
    window.location.hash = '#/signin';
  }

  toggleHeaderFooter();
  
  window.addEventListener('hashchange', () => {
    toggleHeaderFooter();
  });

  const app = new App({
    content: document.querySelector('main'),
  });

  app.init();
});
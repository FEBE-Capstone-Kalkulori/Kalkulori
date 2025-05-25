import HomePage from '../pages/home';
import ProfilePage from '../pages/profile';
import History from '../pages/history';
import addMeal from '../pages/add meal';
import signInPage from '../pages/signin';
import signUpPage from '../pages/signup';

const routes = {
  '/': HomePage,
  '/index.html': HomePage,
  '/home': HomePage,
  '/profile': ProfilePage,
  '/history': History,
  '/add-meal': addMeal,
  '/signin': signInPage,
  '/signup': signUpPage,
};
 
let currentPage = null;

const router = async () => {
  const hash = window.location.hash.slice(1) || '/';
  
  if (currentPage && currentPage.onLeave) {
    currentPage.onLeave();
  }
  
  const page = routes[hash];
  
  if (page) {
    try {
      const content = await page.render();
      document.getElementById('main-content').innerHTML = content;
      
      if (page.afterRender) {
        await page.afterRender();
      }
      
      currentPage = page;
    } catch (error) {
      console.error('Error loading page:', error);
    }
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default routes;
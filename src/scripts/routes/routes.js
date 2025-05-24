import HomePage from '../pages/home';
import ProfilePage from '../pages/profile';
import History from '../pages/history';
import addMeal from '../pages/add meal';

const routes = {
  '/': HomePage,
  '/index.html': HomePage,
  '/home': HomePage,
  '/profile': ProfilePage,
  '/history': History,
  '/add-meal': addMeal,
};
 
let currentPage = null;

const router = async () => {
  const hash = window.location.hash.slice(1) || '/';
  
  // Cleanup halaman sebelumnya
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

// Event listeners
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default routes;
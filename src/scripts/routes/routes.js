import HomePage from '../pages/home';
import ProfilePage from '../pages/profile';
import History from '../pages/history';

const routes = {
  '/': HomePage,
  '/index.html': HomePage,
  '/home': HomePage,
  '/profile': ProfilePage,
  '/history': History,
};

export default routes;
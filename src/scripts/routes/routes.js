import HomePage from '../pages/home';

const routes = {
  '/': HomePage,
  '/index.html': HomePage,
  '/home': HomePage,
  // Komentar route-route lain untuk menghindari error
  // '/history': HistoryPage,
  // '/profile': ProfilePage,
  // '/add-meal': AddMealPage,
};

export default routes;
import routes from './routes/routes';
import AuthGuard from './utils/auth-guard';

class App {
  constructor({ content }) {
    this.content = content;
  }

  async renderPage() {
    let url = window.location.hash.slice(1);
    
    if (!url) {
      if (!AuthGuard.isAuthenticated()) {
        url = '/signin';
        window.location.hash = '#/signin';
      } else {
        url = '/home';
        window.location.hash = '#/home';
      }
    }

    const protectedRoutes = ['/', '/home', '/profile', '/history', '/add-meal'];
    const authRoutes = ['/signin', '/signup'];

    if (protectedRoutes.includes(url) && !AuthGuard.isAuthenticated()) {
      url = '/signin';
      window.location.hash = '#/signin';
    }

    if (authRoutes.includes(url) && AuthGuard.isAuthenticated()) {
      url = '/home';
      window.location.hash = '#/home';
    }
    
    const page = routes[url] || routes['/signin'];
    this.content.innerHTML = await page.render();
    await page.afterRender();
    
    window.scrollTo(0, 0);
  }

  async init() {
    window.addEventListener('hashchange', () => {
      this.renderPage();
    });

    await this.renderPage();
  }
}

export default App;
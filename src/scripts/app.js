import routes from './routes/routes';
import AuthGuard from './utils/auth-guard';

class App {
  constructor({ content }) {
    this.content = content;
    this.header = document.querySelector('header');
    this.footer = document.querySelector('footer');
  }

  toggleHeaderFooter(show = true) {
    if (this.header) {
      this.header.style.display = show ? 'block' : 'none';
    }
    
    document.body.classList.toggle('auth-page', !show);
    document.body.classList.toggle('main-page', show);
  }

  isAuthRoute(url) {
    const authRoutes = ['/signin', '/signup', '/forgot-password'];
    return authRoutes.includes(url);
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

    const showHeaderFooter = !this.isAuthRoute(url);
    this.toggleHeaderFooter(showHeaderFooter);
    
    if (this.isAuthRoute(url)) {
      this.content.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: none !important;
        min-height: 100vh !important;
      `;
    } else {
      this.content.style.cssText = '';
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
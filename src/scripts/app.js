import routes from './routes/routes';

class App {
  constructor({ content }) {
    this.content = content;
  }

  async renderPage() {
    let url = window.location.hash.slice(1);
    
    if (!url) {
      const pathname = window.location.pathname;
      if (pathname.includes('/profile')) {
        url = '/profile';
        window.location.hash = '#/profile';
      } else {
        url = '/';
        window.location.hash = '#/';
      }
    }
    
    const page = routes[url] || routes['/'];
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
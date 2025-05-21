import routes from './routes/routes';

class App {
  constructor({ content }) {
    this.content = content;
    this.initialPage = window.location.pathname;
  }

  async renderPage() {
    const url = window.location.hash.slice(1) || this.initialPage;
    const page = routes[url] || routes['/'];
    this.content.innerHTML = await page.render();
    await page.afterRender();
    
    window.scrollTo(0, 0);
  }

  async init() {
    const { content } = this;

    // Initialize the app
    window.addEventListener('hashchange', () => {
      this.renderPage();
    });

    // Load the initial page
    await this.renderPage();
  }
}

export default App;
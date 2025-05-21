import HomePresenter from './home-presenter';

const home = {
  async render() {
    return `
      <div class="main-content" id="home-container">
        <h1>Selamat Datang di kalkulori</h1>
        <p>Loading content...</p>
      </div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('home-container');
    const homePresenter = new HomePresenter({ container });
    await homePresenter.init();
  }
};

export default home;
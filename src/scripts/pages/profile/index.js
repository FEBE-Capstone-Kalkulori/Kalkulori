import ProfilePresenter from './profile-presenter';

const profile = {
  async render() {
    return `
      <div class="page-outer-wrapper">
        <div class="page-inner-wrapper">
          <div id="profile-container" class="profile-container">
            <h1>Loading profile...</h1>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('profile-container');
    const profilePresenter = new ProfilePresenter({ container });
    await profilePresenter.init();
  }
};

export default profile;
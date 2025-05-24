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
    
    // Simpan reference ke presenter untuk cleanup
    this.presenter = profilePresenter;
  },

  // Method untuk cleanup ketika leave profile page
  onLeave() {
    if (this.presenter && this.presenter.onLeave) {
      this.presenter.onLeave();
    }
  }
};

export default profile;
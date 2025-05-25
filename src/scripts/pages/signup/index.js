import { SignUpPresenter } from './signup-presenter.js';

const signupPage = {
  async render() {
    const content = await SignUpPresenter.init();
    return content;
  },
  
  async afterRender() {
    SignUpPresenter._initEventListeners();
  }
};

export default signupPage;
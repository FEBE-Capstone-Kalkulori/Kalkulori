import { SignUpPresenter } from './signup-presenter.js';

const signupPage = {
  async render() {
    return await SignUpPresenter.init();
  }
};

export default signupPage;
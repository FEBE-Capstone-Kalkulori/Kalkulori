import { SignInPresenter } from "./signin-presenter.js";

const signinPage = {
  async render() {
    const content = await SignInPresenter.init();
    return content;
  },
  
  async afterRender() {
    SignInPresenter._initEventListeners();
  }
};

export default signinPage;
import { SignInPresenter } from "./signin-presenter.js";

const signinPage = {
  async render() {
    return await SignInPresenter.init();
  },
};

export default signinPage;

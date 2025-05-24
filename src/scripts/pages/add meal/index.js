import AddMealPresenter from './add-meal-presenter';

const addMeal = {
  async render() {
    return `<div id="add-meal-container"></div>`;
  },

  async afterRender() {
    const container = document.getElementById('add-meal-container');
    const addMealPresenter = new AddMealPresenter({ container });
    await addMealPresenter.init();
  }
};

export default addMeal;
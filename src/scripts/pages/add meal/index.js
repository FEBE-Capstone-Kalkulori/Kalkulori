import AddMealPresenter from './add-meal-presenter';
import foodApiService from '../../utils/food-api-service';
import mealApiService from '../../utils/meal-api-service';

const addMeal = {
  async render() {
    return `<div id="add-meal-container"></div>`;
  },

  async afterRender() {
    if (typeof window !== 'undefined') {
      window.foodApiService = foodApiService;
      window.mealApiService = mealApiService;
    }
    
    const container = document.getElementById('add-meal-container');
    const addMealPresenter = new AddMealPresenter({ container });
    await addMealPresenter.init();
  }
};

export default addMeal;
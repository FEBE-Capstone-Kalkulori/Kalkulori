import AddMealView from './add-meal-view';
import { defaultMealsData } from '../../pages/templates/foodCard';

class AddMealPresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      searchQuery: '',
      meals: defaultMealsData
    };
    
    this.eventHandlers = {
      onSearchClicked: this._handleSearch.bind(this),
      onBackClicked: this._handleBack.bind(this)
    };
  }

  async init() {
    try {
      this._renderView();
    } catch (error) {
      console.error('Failed to initialize Add Meal page:', error);
    }
  }

  _renderView() {
    AddMealView.render(this.container, this.data);
    AddMealView.afterRender(this.eventHandlers);
  }

  _handleSearch(query) {
    this.data.searchQuery = query;
    if (query.trim()) {
      this.data.meals = defaultMealsData.filter(meal => 
        meal.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.data.meals = defaultMealsData;
    }
    console.log(`Searching for: ${query}`);
    this._renderView();
  }

  _handleBack() {
    window.location.hash = '#/';
  }
}

export default AddMealPresenter;
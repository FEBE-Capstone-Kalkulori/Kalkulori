import AddMealView from './add-meal-view';
import { defaultMealsData } from '../../pages/templates/foodCard';
import foodApiService from '../../utils/food-api-service'; // Sesuaikan path dengan struktur folder Anda

class AddMealPresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      searchQuery: '',
      meals: [],
      loading: false,
      error: null
    };
    
    this.eventHandlers = {
      onSearchClicked: this._handleSearch.bind(this),
      onBackClicked: this._handleBack.bind(this)
    };
  }

  async init() {
    try {
      this.data.loading = true;
      this._renderView();
      
      // Load initial foods from API
      await this._loadFoods();
    } catch (error) {
      console.error('Failed to initialize Add Meal page:', error);
      this.data.error = 'Failed to load foods. Using default data.';
      this.data.meals = defaultMealsData; // Fallback ke data default
      this._renderView();
    }
  }

  async _loadFoods(searchQuery = '') {
    try {
      this.data.loading = true;
      this.data.error = null;
      this._renderView();

      let foods;
      if (searchQuery.trim()) {
        // Search foods by name
        foods = await foodApiService.searchFoods(searchQuery, 50);
      } else {
        // Get all foods
        foods = await foodApiService.getAllFoods({ limit: 50 });
      }

      // Format foods untuk kompatibilitas dengan FoodCard
      this.data.meals = foodApiService.formatFoodsForCards(foods);
      
      // Jika tidak ada hasil dari API, gunakan data default
      if (this.data.meals.length === 0 && !searchQuery.trim()) {
        this.data.meals = defaultMealsData;
      }

    } catch (error) {
      console.error('Error loading foods:', error);
      this.data.error = 'Failed to load foods from server.';
      
      // Fallback: filter default data jika ada search query
      if (searchQuery.trim()) {
        this.data.meals = defaultMealsData.filter(meal => 
          meal.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.data.meals = defaultMealsData;
      }
    } finally {
      this.data.loading = false;
      this._renderView();
    }
  }

  _renderView() {
    AddMealView.render(this.container, this.data);
    AddMealView.afterRender(this.eventHandlers);
  }

  async _handleSearch(query) {
    this.data.searchQuery = query;
    console.log(`Searching for: ${query}`);
    
    // Load foods with search query
    await this._loadFoods(query);
  }

  _handleBack() {
    window.location.hash = '#/';
  }
}

export default AddMealPresenter;
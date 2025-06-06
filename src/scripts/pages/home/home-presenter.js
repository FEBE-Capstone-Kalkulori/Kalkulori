import HomeView from './home-view';
import mealApiService from '../../utils/meal-api-service';

class HomePresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      currentCalories: 0,
      calorieLimit: 1500,
      selectedOptions: [],
      dailyLog: null,
      mealEntries: [],
      loading: true,
      error: null,
      mealPlan: [
        {
          type: 'Breakfast',
          name: 'Fried Chicken Wings',
          image: './public/image/meals/fried-chicken-wings.jpg',
          calories: 400
        },
        {
          type: 'Lunch',
          name: 'Fried Rice with Egg',
          image: './public/image/meals/fried-rice-egg.jpg',
          calories: 450
        },
        {
          type: 'Dinner',
          name: 'Soto Ayam',
          image: './public/image/meals/soto-ayam.jpg',
          calories: 350
        }
      ],
      suggestedMeals: [
        {
          name: 'Chicken Soto',
          image: './public/image/meals/chicken-soto.jpg',
          calories: 312
        },
        {
          name: 'Fried Noodles',
          image: './public/image/meals/fried-noodles.jpg',
          calories: 280
        },
        {
          name: 'Meatballs Soup',
          image: './public/image/meals/meatballs-soup.jpg',
          calories: 283
        },
        {
          name: 'Noodles Soup',
          image: './public/image/meals/noodles-soup.jpg',
          calories: 137
        }
      ]
    };
    
    this.eventHandlers = {
      onAddMealClicked: this._handleAddMeal.bind(this),
      onSuggestionOptionClicked: this._handleSuggestionOption.bind(this),
      onSuggestionDoneClicked: this._handleSuggestionDone.bind(this),
      onDeleteMealClicked: this._handleDeleteMeal.bind(this)
    };
  }

  async init() {
    try {
      this.data.loading = true;
      this._renderView();
      
      await this._fetchDailyData();
    } catch (error) {
      console.error('Failed to initialize Home page:', error);
      this.data.error = 'Failed to load daily data';
      this.data.loading = false;
      this._renderView();
    }
  }

  async _fetchDailyData() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyData = await mealApiService.getDailyLog(today);
      
      this.data.dailyLog = dailyData.daily_log;
      this.data.mealEntries = dailyData.meal_entries || [];
      this.data.currentCalories = dailyData.daily_log.total_calories_consumed || 0;
      
      if (dailyData.daily_log.remaining_calories !== undefined) {
        this.data.calorieLimit = this.data.currentCalories + dailyData.daily_log.remaining_calories;
      }
      
    } catch (error) {
      console.error('Error fetching daily data:', error);
      this.data.error = 'Unable to load today\'s data';
      this.data.currentCalories = 0;
      this.data.calorieLimit = 1500;
      this.data.mealEntries = [];
      this.data.dailyLog = null;
    } finally {
      this.data.loading = false;
      this._renderView();
    }
  }

  _renderView() {
    HomeView.render(this.container, this.data);
    HomeView.afterRender(this.eventHandlers);
  }

  _handleAddMeal() {
    window.location.hash = '#/add-meal';
  }

  _handleSuggestionOption(option) {
    console.log(`Suggestion option selected: ${option}`);
    this.data.selectedOptions.push(option);
    this._renderView();
  }

  _handleSuggestionDone() {
    console.log('Suggestion done button clicked');
    this.data.selectedOptions = [];
    this._renderView();
  }

  async _handleDeleteMeal(mealId) {
    try {
      this.data.loading = true;
      this._renderView();
      
      await mealApiService.deleteMealEntry(mealId);
      
      await this._fetchDailyData();
      
      console.log('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal. Please try again.');
      this.data.loading = false;
      this._renderView();
    }
  }
}

export default HomePresenter;
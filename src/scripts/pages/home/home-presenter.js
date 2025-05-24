import HomeView from './home-view';

class HomePresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      currentCalories: 0,
      calorieLimit: 1500,
      selectedOptions: [],
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
      onSuggestionDoneClicked: this._handleSuggestionDone.bind(this)
    };
  }

  async init() {
    try {
      this._renderView();
    } catch (error) {
      console.error('Failed to initialize Home page:', error);
    }
  }

  async _fetchUserData() {
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
}

export default HomePresenter;
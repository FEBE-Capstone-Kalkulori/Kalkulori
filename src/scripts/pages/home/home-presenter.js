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
      // In a real app, you'd fetch user data, meal plans, etc.
      // await this._fetchUserData();
      this._renderView();
    } catch (error) {
      console.error('Failed to initialize Home page:', error);
    }
  }

  async _fetchUserData() {
    // This would be implemented to fetch real data from your API
    // For now, we're using mock data in the constructor
  }

  _renderView() {
    HomeView.render(this.container, this.data);
    HomeView.afterRender(this.eventHandlers);
  }

  _handleAddMeal() {
    // In a real app, this would navigate to the add meal page or open a modal
    console.log('Add Meal button clicked');
    // For demonstration, we'll just add 200 calories
    this.data.currentCalories += 200;
    if (this.data.currentCalories > this.data.calorieLimit) {
      this.data.currentCalories = this.data.calorieLimit;
    }
    this._renderView();
  }

  _handleSuggestionOption(option) {
    console.log(`Suggestion option selected: ${option}`);
    // In a real app, this would filter suggestions based on the selected option
    this.data.selectedOptions.push(option);
    // Re-render the view with updated data
    this._renderView();
  }

  _handleSuggestionDone() {
    console.log('Suggestion done button clicked');
    // In a real app, this would finalize the suggestion process
    this.data.selectedOptions = [];
    // Re-render the view with updated data
    this._renderView();
  }
}

export default HomePresenter;
const createAddMealTemplate = (data) => {
  return `
    <div class="add-meal-container">
      <div class="add-meal-header">
        <button class="back-button" id="back-button">
          <span class="back-icon">‹</span>
          <span>Back</span>
        </button>
        <h1 class="add-meal-title">Search Meal</h1>
      </div>
      
      <div class="search-section">
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            id="search-input"
            placeholder="What food that you ate?"
            value="${data.searchQuery}"
          />
          <button class="search-button" id="search-button">Search</button>
        </div>
      </div>
      
      <div class="container" id="food-container">
        ${data.meals.length > 0 ? createMealsGrid(data.meals) : ''}
      </div>
    </div>
  `;
};

const createMealsGrid = (meals) => {
  return meals.map(meal => 
    window.FoodCard.createFoodCard(meal.image, meal.name, meal.calories)
  ).join('');
};

export default {
  render(container, data) {
    container.innerHTML = createAddMealTemplate(data);
  },
  
  afterRender(eventHandlers) {
    const backButton = document.getElementById('back-button');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const foodContainer = document.getElementById('food-container');
    
    if (backButton && eventHandlers.onBackClicked) {
      backButton.addEventListener('click', eventHandlers.onBackClicked);
    }
    
    if (searchButton && eventHandlers.onSearchClicked) {
      searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        eventHandlers.onSearchClicked(query);
      });
    }
    
    if (searchInput && eventHandlers.onSearchClicked) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value;
          eventHandlers.onSearchClicked(query);
        }
      });
    }
    
    if (foodContainer) {
      window.FoodCard.bindFoodCardEvents('food-container');
    }
  }
};
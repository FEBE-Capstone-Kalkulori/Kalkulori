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
      
      <div class="meals-grid" id="meals-grid">
        ${data.meals.length > 0 ? createMealsGrid(data.meals) : ''}
      </div>
    </div>
  `;
};

const createMealsGrid = (meals) => {
  return meals.map(meal => `
    <div class="meal-card">
      <div class="meal-image">
        <img src="${meal.image}" alt="${meal.name}">
      </div>
      <div class="meal-info">
        <div class="meal-name">${meal.name}</div>
        <div class="meal-calories">${meal.calories} kcal</div>
      </div>
      <button class="add-meal-card-button">+</button>
    </div>
  `).join('');
};

export default {
  render(container, data) {
    container.innerHTML = createAddMealTemplate(data);
  },
  
  afterRender(eventHandlers) {
    const backButton = document.getElementById('back-button');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
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
  }
};
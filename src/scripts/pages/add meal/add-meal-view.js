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
            ${data.loading ? 'disabled' : ''}
          />
          <button class="search-button" id="search-button" ${data.loading ? 'disabled' : ''}>
            ${data.loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>
      
      ${createContentSection(data)}
      
      ${createPaginationSection(data)}
    </div>
  `;
};

const createContentSection = (data) => {
  if (data.loading) {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading foods...</p>
      </div>
    `;
  }

  if (data.error) {
    return `
      <div class="error-container">
        <p class="error-message">${data.error}</p>
        ${data.meals.length > 0 ? createMealsContainer(data.meals) : ''}
      </div>
    `;
  }

  if (data.meals.length === 0) {
    return `
      <div class="no-results-container">
        <p class="no-results-message">
          ${data.searchQuery ? `No foods found for "${data.searchQuery}"` : 'No foods available'}
        </p>
      </div>
    `;
  }

  return createMealsContainer(data.meals);
};

const createMealsContainer = (meals) => {
  return `
    <div class="container" id="food-container">
      ${createMealsGrid(meals)}
    </div>
  `;
};

const createMealsGrid = (meals) => {
  return meals.map(meal => 
    window.FoodCard.createFoodCard(meal.image, meal.name, meal.calories)
  ).join('');
};

const createPaginationSection = (data) => {
  if (data.loading || data.meals.length === 0) {
    return '';
  }

  const hasPages = data.pagination.has_next_page || data.pagination.has_prev_page;
  
  if (!hasPages) {
    return '';
  }

  return `
    <div class="pagination-container">
      <button 
        class="pagination-btn" 
        id="prev-button"
        ${!data.pagination.has_prev_page ? 'disabled' : ''}
      >
        Previous
      </button>
      
      <button 
        class="pagination-btn" 
        id="next-button"
        ${!data.pagination.has_next_page ? 'disabled' : ''}
      >
        Next
      </button>
    </div>
  `;
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
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
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

    if (prevButton && eventHandlers.onPreviousClicked) {
      prevButton.addEventListener('click', eventHandlers.onPreviousClicked);
    }

    if (nextButton && eventHandlers.onNextClicked) {
      nextButton.addEventListener('click', eventHandlers.onNextClicked);
    }
    
    if (foodContainer) {
      window.FoodCard.bindFoodCardEvents('food-container');
    }
  }
};
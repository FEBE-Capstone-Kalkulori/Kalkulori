const createAddMealTemplate = (data) => {
  return `
    <div class="add-meal-container">
      <div class="add-meal-header">
        <button class="back-button" id="back-button">
          <span class="back-icon">‹</span>
          <span>Back</span>
        </button>
        <h1 class="add-meal-title">${data.isSearchMode ? 'Search Results' : 'Search Meal'}</h1>
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
            ${data.loading ? 'Searching...' : 'Search'}
          </button>
          ${data.isSearchMode && data.searchQuery ? `
            <button class="clear-search-button" id="clear-search-button">
              Clear Search
            </button>
          ` : ''}
        </div>
        ${data.isSearchMode ? createSearchInfo(data) : ''}
      </div>
      
      ${createContentSection(data)}
      
      ${createPaginationSection(data)}
    </div>
  `;
};

const createSearchInfo = (data) => {
  if (!data.isSearchMode || !data.searchQuery) return '';
  
  return `
    <div class="search-info">
      <p class="search-query-info">
        ${data.loading ? 'Searching...' : 
          data.meals.length > 0 ? 
            `Found ${data.meals.length} results for "<strong>${data.searchQuery}</strong>"` :
            `No results found for "<strong>${data.searchQuery}</strong>"`
        }
      </p>
      ${data.meals.length > 0 ? '<p class="search-note">Search results are powered by AI and may include estimated nutritional values.</p>' : ''}
    </div>
  `;
};

const createContentSection = (data) => {
  if (data.loading) {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>${data.isSearchMode ? 'Searching foods...' : 'Loading foods...'}</p>
      </div>
    `;
  }

  if (data.error) {
    return `
      <div class="error-container">
        <p class="error-message">${data.error}</p>
        ${data.meals.length > 0 ? createMealsContainer(data.meals) : ''}
        ${data.isSearchMode && data.meals.length === 0 ? `
          <div class="search-suggestions">
            <h3>Search Tips:</h3>
            <ul>
              <li>Try using different keywords</li>
              <li>Use more general terms (e.g., "chicken" instead of "grilled chicken breast")</li>
              <li>Check your spelling</li>
              <li>Try searching in English</li>
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (data.meals.length === 0) {
    return `
      <div class="no-results-container">
        <p class="no-results-message">
          ${data.searchQuery ? 
            `No foods found for "${data.searchQuery}"` : 
            'No foods available'
          }
        </p>
        ${data.isSearchMode ? `
          <div class="search-suggestions">
            <h3>Try these tips:</h3>
            <ul>
              <li>Use different or more general keywords</li>
              <li>Check your spelling</li>
              <li>Try common food names in English</li>
              <li>Use single words instead of full phrases</li>
            </ul>
            <button class="browse-all-button" id="browse-all-button">
              Browse All Foods
            </button>
          </div>
        ` : ''}
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
    window.FoodCard.createFoodCard(
      meal.image, 
      meal.name, 
      meal.calories,
      meal.id,
      meal.serving_size,
      meal.serving_unit,
      meal.is_from_search,
      meal.recipe_id,
      meal.protein,
      meal.carbs,
      meal.fat
    )
  ).join('');
};

const createPaginationSection = (data) => {
  if (data.loading || data.meals.length === 0 || data.isSearchMode) {
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
      
      <span class="pagination-info">
        Page ${data.currentPage + 1}
      </span>
      
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

const bindEventListeners = (eventHandlers) => {
  const backButton = document.getElementById('back-button');
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const clearSearchButton = document.getElementById('clear-search-button');
  const browseAllButton = document.getElementById('browse-all-button');
  const foodContainer = document.getElementById('food-container');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  
  if (backButton && eventHandlers.onBackClicked) {
    backButton.addEventListener('click', eventHandlers.onBackClicked);
  }
  
  if (searchButton && eventHandlers.onSearchClicked) {
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        eventHandlers.onSearchClicked(query);
      }
    });
  }
  
  if (searchInput && eventHandlers.onSearchClicked) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          eventHandlers.onSearchClicked(query);
        }
      }
    });
    
    searchInput.focus();
  }

  if (clearSearchButton && eventHandlers.onClearSearchClicked) {
    clearSearchButton.addEventListener('click', eventHandlers.onClearSearchClicked);
  }

  if (browseAllButton && eventHandlers.onClearSearchClicked) {
    browseAllButton.addEventListener('click', eventHandlers.onClearSearchClicked);
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
};

export default {
  render(container, data, eventHandlers) {
    container.innerHTML = createAddMealTemplate(data);
    bindEventListeners(eventHandlers);
  }
};
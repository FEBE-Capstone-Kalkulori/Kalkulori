const createHomeTemplate = (data) => {
  return `
    <div class="page-outer-wrapper">
      <div class="page-inner-wrapper">
        <div class="content-layout">
          <div class="left-column">
            <div class="content-box daily-calories-box">
              <h2>Daily Calories</h2>
              ${createCalorieTracker(data)}
              ${createTodaysMeals(data)}
            </div>
          </div>

          <div class="right-column">
            <div class="content-box suggestion-box">
              <h2>Suggestion Meals</h2>
              <div class="suggestion-input">
                <div class="suggestion-question">What do you want to eat today?</div>
                <button class="suggestion-option" id="savory-option">savory</button>
                <button class="suggestion-done" id="suggestion-done">Done</button>
              </div>
            </div>

            <div class="suggestions-grid">
              ${createSuggestionsGrid(data.suggestedMeals)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const createCalorieTracker = (data) => {
  if (data.loading) {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading calorie data...</p>
      </div>
    `;
  }

  const percentage = Math.min((data.currentCalories / data.calorieLimit) * 100, 100);
  const remaining = Math.max(data.calorieLimit - data.currentCalories, 0);
  
  return `
    <div class="calorie-counter">
      <div class="calorie-display">
        <div class="calorie-number">${data.currentCalories}</div>
        <div class="calorie-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
        <div class="calorie-remaining">${remaining} kcal left!</div>
      </div>
      <button class="add-meal-btn" id="add-meal-button">Add Meal</button>
    </div>
  `;
};

const createTodaysMeals = (data) => {
  if (data.loading) {
    return `
      <div class="loading-container">
        <p>Loading today's meals...</p>
      </div>
    `;
  }

  if (data.mealEntries.length === 0) {
    return `
      <div class="todays-meals-section">
        <h3 class="todays-meals-title">Today's Meals</h3>
        <div class="no-meals-container">
          <p class="no-meals-message">No meals added today</p>
        </div>
      </div>
    `;
  }

  const mealsByType = groupMealsByType(data.mealEntries);
  
  return `
    <div class="todays-meals-section">
      <h3 class="todays-meals-title">Today's Meals</h3>
      <div class="todays-meals">
        ${Object.entries(mealsByType).map(([mealType, meals]) => `
          <div class="meal-type-section">
            <h4 class="meal-type-title">${capitalizeFirst(mealType)}</h4>
            <div class="meal-entries-compact">
              ${meals.map(meal => createCompactMealCard(meal)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const createCompactMealCard = (meal) => {
  const foodDetails = meal.food_details;
  const totalCalories = Math.round(meal.calories);
  
  return `
    <div class="compact-meal-card" data-meal-id="${meal.id}">
      <div class="compact-meal-image">
        <img src="${foodDetails?.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}" alt="${foodDetails?.food_name || 'Food'}">
      </div>
      <div class="compact-meal-info">
        <span class="compact-meal-name">${foodDetails?.food_name || 'Unknown Food'}</span>
        <span class="compact-meal-details">${meal.servings}x • ${totalCalories} kcal</span>
      </div>
      <button class="delete-meal-btn" data-meal-id="${meal.id}" title="Remove meal">
        <span>&times;</span>
      </button>
    </div>
  `;
};

const createSuggestionsGrid = (suggestedMeals) => {
  return suggestedMeals.map(meal => `
    <div class="suggestion-meal-item">
      <div class="suggestion-meal-image">
        <img src="${meal.image}" alt="${meal.name}">
      </div>
      <div class="suggestion-meal-details">
        <div class="suggestion-meal-name">${meal.name}</div>
        <div class="suggestion-meal-calories">${meal.calories} kcal</div>
      </div>
    </div>
  `).join('');
};

const groupMealsByType = (mealEntries) => {
  return mealEntries.reduce((groups, meal) => {
    const type = meal.meal_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(meal);
    return groups;
  }, {});
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export default {
  render(container, data) {
    container.innerHTML = createHomeTemplate(data);
  },
  
  afterRender(eventHandlers) {
    const addMealButton = document.getElementById('add-meal-button');
    const savoryOption = document.getElementById('savory-option');
    const suggestionDone = document.getElementById('suggestion-done');
    const deleteMealButtons = document.querySelectorAll('.delete-meal-btn');
    
    if (addMealButton && eventHandlers.onAddMealClicked) {
      addMealButton.addEventListener('click', eventHandlers.onAddMealClicked);
    }
    
    if (savoryOption && eventHandlers.onSuggestionOptionClicked) {
      savoryOption.addEventListener('click', () => {
        eventHandlers.onSuggestionOptionClicked('savory');
      });
    }
    
    if (suggestionDone && eventHandlers.onSuggestionDoneClicked) {
      suggestionDone.addEventListener('click', eventHandlers.onSuggestionDoneClicked);
    }
    
    if (deleteMealButtons && eventHandlers.onDeleteMealClicked) {
      deleteMealButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const mealId = button.dataset.mealId;
          if (mealId && confirm('Are you sure you want to remove this meal?')) {
            eventHandlers.onDeleteMealClicked(mealId);
          }
        });
      });
    }
  }
};
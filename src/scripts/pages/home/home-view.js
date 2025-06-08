import { MEAL_CATEGORIES } from './meal-categories.js';
import { createMealPlanSection, attachMealPlanEventHandlers } from './meal-plan.js';

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
            
            <div class="content-box meal-plan-box">
              <h2>Meal Plan</h2>
              ${createMealPlanSection(data.mealPlan)}
            </div>
          </div>

          <div class="right-column">
            <div class="content-box suggestion-box">
              <h2>Meal Preferences</h2>
              ${createCategoriesGrid(data)}
              ${createSelectedKeywords(data)}
            </div>

            <div class="suggestions-grid">
              ${createSuggestionsGrid(data.suggestedMeals)}
            </div>
          </div>
        </div>
      </div>
    </div>
    ${createCategoryPopup(data)}
  `;
};

const createCategoriesGrid = (data) => {
  return `
    <div class="categories-container">
      <p class="categories-description">Choose your meal preferences:</p>
      <div class="categories-grid">
        ${Object.entries(MEAL_CATEGORIES).map(([key, category]) => `
          <div class="category-card" data-category="${key}">
            <div class="category-icon">${category.icon}</div>
            <div class="category-title">${category.title}</div>
            <div class="category-count">${data.selectedKeywords ? data.selectedKeywords.filter(k => category.keywords.includes(k)).length : 0} selected</div>
          </div>
        `).join('')}
      </div>
      ${data.selectedKeywords && data.selectedKeywords.length > 0 ? `
        <div class="action-buttons">
          <button class="find-meals-btn" id="find-meals-button">Find Meals</button>
          <button class="clear-all-btn" id="clear-all-button">Clear All</button>
        </div>
      ` : ''}
    </div>
  `;
};

const createSelectedKeywords = (data) => {
  if (!data.selectedKeywords || data.selectedKeywords.length === 0) {
    return '';
  }

  return `
    <div class="selected-keywords-container">
      <h4>Selected Preferences:</h4>
      <div class="selected-keywords">
        ${data.selectedKeywords.map(keyword => `
          <span class="keyword-tag">
            ${keyword}
            <button class="remove-keyword" data-keyword="${keyword}">&times;</button>
          </span>
        `).join('')}
      </div>
    </div>
  `;
};

const createCategoryPopup = (data) => {
  return `
    <div class="category-popup-overlay" id="category-popup-overlay">
      <div class="category-popup">
        <div class="popup-header">
          <h3 id="popup-title">Category</h3>
          <button class="popup-close" id="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <div class="keywords-grid" id="keywords-grid">
          </div>
        </div>
        <div class="popup-footer">
          <button class="popup-done-btn" id="popup-done">Done</button>
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

export default {
  render(container, data) {
    container.innerHTML = createHomeTemplate(data);
  },
  
  afterRender(eventHandlers) {
    const addMealButton = document.getElementById('add-meal-button');
    const deleteMealButtons = document.querySelectorAll('.delete-meal-btn');
    
    const categoryCards = document.querySelectorAll('.category-card');
    const popupOverlay = document.getElementById('category-popup-overlay');
    const popupClose = document.getElementById('popup-close');
    const popupDone = document.getElementById('popup-done');
    const findMealsButton = document.getElementById('find-meals-button');
    const clearAllButton = document.getElementById('clear-all-button');
    const removeKeywordButtons = document.querySelectorAll('.remove-keyword');
    
    if (addMealButton && eventHandlers.onAddMealClicked) {
      addMealButton.addEventListener('click', eventHandlers.onAddMealClicked);
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

    if (categoryCards && eventHandlers.onCategoryClicked) {
      categoryCards.forEach(card => {
        card.addEventListener('click', () => {
          const category = card.dataset.category;
          eventHandlers.onCategoryClicked(category);
        });
      });
    }

    if (popupOverlay && eventHandlers.onPopupClosed) {
      popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
          eventHandlers.onPopupClosed();
        }
      });
    }

    if (popupClose && eventHandlers.onPopupClosed) {
      popupClose.addEventListener('click', eventHandlers.onPopupClosed);
    }

    if (popupDone && eventHandlers.onPopupClosed) {
      popupDone.addEventListener('click', eventHandlers.onPopupClosed);
    }

    if (findMealsButton && eventHandlers.onFindMealsClicked) {
      findMealsButton.addEventListener('click', eventHandlers.onFindMealsClicked);
    }

    if (clearAllButton && eventHandlers.onClearAllClicked) {
      clearAllButton.addEventListener('click', eventHandlers.onClearAllClicked);
    }

    if (removeKeywordButtons && eventHandlers.onKeywordRemoved) {
      removeKeywordButtons.forEach(button => {
        button.addEventListener('click', () => {
          const keyword = button.dataset.keyword;
          eventHandlers.onKeywordRemoved(keyword);
        });
      });
    }

    attachMealPlanEventHandlers(
      eventHandlers.onGenerateMealPlan,
      eventHandlers.onMealPlanItemClicked,
      eventHandlers.onCompleteProfileClicked
    );
  },

  showCategoryPopup(category, selectedKeywords = []) {
    const popup = document.getElementById('category-popup-overlay');
    const title = document.getElementById('popup-title');
    const keywordsGrid = document.getElementById('keywords-grid');
    
    if (!popup || !title || !keywordsGrid) return;

    const categoryData = MEAL_CATEGORIES[category];
    if (!categoryData) return;

    title.textContent = categoryData.title;
    
    keywordsGrid.innerHTML = categoryData.keywords.map(keyword => `
      <div class="keyword-item ${selectedKeywords.includes(keyword) ? 'selected' : ''}" data-keyword="${keyword}">
        <span class="keyword-text">${keyword}</span>
        <span class="keyword-check">✓</span>
      </div>
    `).join('');

    const keywordItems = keywordsGrid.querySelectorAll('.keyword-item');
    keywordItems.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        const keyword = item.dataset.keyword;
        
        const event = new CustomEvent('keywordToggled', {
          detail: { keyword, selected: item.classList.contains('selected') }
        });
        document.dispatchEvent(event);
      });
    });

    popup.style.display = 'flex';
  },

  hideCategoryPopup() {
    const popup = document.getElementById('category-popup-overlay');
    if (popup) {
      popup.style.display = 'none';
    }
  }
};
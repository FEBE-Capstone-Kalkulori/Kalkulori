import { MEAL_CATEGORIES } from './meal-categories.js';
import { createMealPlanSection, attachMealPlanEventHandlers } from './meal-plan.js';
import Header from '../../components/header.js';

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

            <div class="content-box meal-suggestions-box">
              <h2>Meal Suggestions</h2>
              ${createMealSuggestionsSection(data)}
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
      <p class="categories-description">Choose your meal preferences (max 6):</p>
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
          <button class="find-meals-btn" id="find-meals-button" ${data.selectedKeywords.length > 6 ? 'disabled' : ''}>
            ${data.mealSuggestions?.loading ? 'Finding Meals...' : 'Find Meals'}
          </button>
          <button class="clear-all-btn" id="clear-all-button">Clear All</button>
        </div>
        ${data.selectedKeywords.length > 6 ? `
          <p class="keyword-limit-warning">⚠️ Maximum 6 keywords allowed. Please remove some keywords.</p>
        ` : ''}
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
      <h4>Selected Preferences (${data.selectedKeywords.length}/6):</h4>
      <div class="selected-keywords">
        ${data.selectedKeywords.map(keyword => `
          <span class="keyword-tag ${data.selectedKeywords.length > 6 ? 'over-limit' : ''}">
            ${keyword}
            <button class="remove-keyword" data-keyword="${keyword}">&times;</button>
          </span>
        `).join('')}
      </div>
    </div>
  `;
};

const createMealSuggestionsSection = (data) => {
  if (data.mealSuggestions?.loading) {
    return `
      <div class="meal-suggestions-loading">
        <div class="loading-spinner"></div>
        <p>Finding personalized meal suggestions...</p>
      </div>
    `;
  }

  if (data.mealSuggestions?.error) {
    return `
      <div class="meal-suggestions-error">
        <p class="error-message">${data.mealSuggestions.error}</p>
        <div class="suggestions-grid">
          ${createSuggestionsFoodCards(data.suggestedMeals || [])}
        </div>
      </div>
    `;
  }

  const suggestionsToShow = data.mealSuggestions?.data || data.suggestedMeals || [];
  const hasKeywords = data.selectedKeywords && data.selectedKeywords.length > 0;
  const isFromAPI = data.mealSuggestions?.isFromAPI;

  return `
    <div class="meal-suggestions-content">
      ${hasKeywords && isFromAPI ? `
        <p class="suggestions-info">✨ Personalized suggestions based on your preferences</p>
      ` : hasKeywords ? `
        <p class="suggestions-info">💡 Click "Find Meals" to get personalized suggestions</p>
      ` : `
        <p class="suggestions-info">🍽️ Popular meal recommendations</p>
      `}
      
      <div class="suggestions-grid" id="suggestions-food-container">
        ${createSuggestionsFoodCards(suggestionsToShow)}
      </div>
      
      ${suggestionsToShow.length === 0 ? `
        <div class="no-suggestions">
          <p>No meal suggestions available. Try selecting some preferences and click "Find Meals"!</p>
        </div>
      ` : ''}
    </div>
  `;
};

const createSuggestionsFoodCards = (suggestions) => {
  if (!suggestions || suggestions.length === 0) {
    return '<p class="no-suggestions-text">No suggestions available</p>';
  }

  return suggestions.map(meal => `
    <div class="suggestion-food-card" data-meal-id="${meal.id || ''}" data-serving-size="${meal.serving_size || 1}" data-serving-unit="${meal.serving_unit || 'serving'}">
      <div class="suggestion-food-image" data-meal-details-trigger>
        <img src="${meal.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}" alt="${meal.name}">
        <div class="image-overlay">
          <span class="view-details-text">👁️ View Details</span>
        </div>
      </div>
      <div class="suggestion-food-info">
        <h3 class="suggestion-food-name">${meal.name}</h3>
        <p class="suggestion-food-calories">${meal.calories} kcal</p>
        ${meal.protein !== undefined ? `
          <div class="suggestion-food-nutrition">
            <span>P: ${Math.round(meal.protein || 0)}g</span>
            <span>C: ${Math.round(meal.carbohydrate || 0)}g</span>
            <span>F: ${Math.round(meal.fat || 0)}g</span>
          </div>
        ` : ''}
      </div>
      <button class="suggestion-add-button" data-add-meal-trigger>
        <span class="plus-icon">+</span>
      </button>
    </div>
  `).join('');
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
  
  let totalCalories = 0;
  
  if (meal.calories) {
    totalCalories = Math.round(meal.calories);
  } else if (meal.calories_consumed) {
    totalCalories = Math.round(meal.calories_consumed);
  } else if (foodDetails && foodDetails.calories_per_serving && meal.servings) {
    totalCalories = Math.round(foodDetails.calories_per_serving * meal.servings);
  } else if (meal.servings && foodDetails) {
    const caloriesPerServing = foodDetails.calories_per_serving || 0;
    totalCalories = Math.round(caloriesPerServing * meal.servings);
  }

  if (totalCalories === 0 && meal.servings > 0) {
    const anyCalories = meal.calories || meal.calories_consumed || 
                       (foodDetails && foodDetails.calories_per_serving) || 0;
    totalCalories = Math.round(anyCalories);
  }
  
  let foodName = 'Unknown Food';
  if (foodDetails && foodDetails.food_name) {
    foodName = foodDetails.food_name;
  } else if (meal.food_name) {
    foodName = meal.food_name;
  } else if (meal.is_from_search) {
    foodName = 'Search Result';
  } else if (meal.is_from_recipe) {
    foodName = 'Recipe Meal';
  }
  
  let imageUrl = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  if (foodDetails && foodDetails.image_url) {
    imageUrl = foodDetails.image_url;
  }
  
  return `
    <div class="compact-meal-card" data-meal-id="${meal.id}">
      <div class="compact-meal-image">
        <img src="${imageUrl}" alt="${foodName}" onerror="this.src='https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'">
      </div>
      <div class="compact-meal-info">
        <span class="compact-meal-name">${foodName}</span>
        <span class="compact-meal-details">${meal.servings || 1}x • ${totalCalories} kcal</span>
      </div>
      <button class="delete-meal-btn" data-meal-id="${meal.id}" title="Remove meal">
        <span>&times;</span>
      </button>
    </div>
  `;
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

function extractMealDataFromCard(foodCard) {
  const nameElement = foodCard.querySelector('.suggestion-food-name');
  const caloriesElement = foodCard.querySelector('.suggestion-food-calories');
  const imageElement = foodCard.querySelector('.suggestion-food-image img');
  const nutritionElements = foodCard.querySelectorAll('.suggestion-food-nutrition span');
  
  const mealData = {
    id: foodCard.dataset.mealId || null,
    name: nameElement?.textContent || 'Unknown Meal',
    calories: parseInt(caloriesElement?.textContent?.replace(' kcal', '')) || 0,
    image: imageElement?.src || '',
    serving_size: parseFloat(foodCard.dataset.servingSize) || 1,
    serving_unit: foodCard.dataset.servingUnit || 'serving'
  };

  if (nutritionElements.length >= 3) {
    mealData.protein = parseFloat(nutritionElements[0]?.textContent?.replace('P: ', '').replace('g', '')) || 0;
    mealData.carbohydrate = parseFloat(nutritionElements[1]?.textContent?.replace('C: ', '').replace('g', '')) || 0;
    mealData.fat = parseFloat(nutritionElements[2]?.textContent?.replace('F: ', '').replace('g', '')) || 0;
  }

  return mealData;
}

export default {
  render(container, data) {
    const header = new Header();
    const headerContainer = document.getElementById('header-container') || document.querySelector('header');
    
    if (headerContainer) {
      headerContainer.innerHTML = header.render('home');
      header.addSliderStyles();
      header.initSlider();
    }
    
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
    
    const suggestionAddButtons = document.querySelectorAll('[data-add-meal-trigger]');
    const suggestionDetailsTriggers = document.querySelectorAll('[data-meal-details-trigger]');
    
    if (addMealButton && eventHandlers.onAddMealClicked) {
      addMealButton.addEventListener('click', eventHandlers.onAddMealClicked);
    }
    
    if (deleteMealButtons && eventHandlers.onDeleteMealClicked) {
      deleteMealButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const mealId = button.dataset.mealId;
          if (mealId) {
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

    if (suggestionAddButtons && eventHandlers.onSuggestedMealClicked) {
      suggestionAddButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const foodCard = button.closest('.suggestion-food-card');
          if (!foodCard) return;
          
          const mealData = extractMealDataFromCard(foodCard);
          eventHandlers.onSuggestedMealClicked(mealData);
        });
      });
    }

    if (suggestionDetailsTriggers && eventHandlers.onSuggestedMealDetailsClicked) {
      suggestionDetailsTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const foodCard = trigger.closest('.suggestion-food-card');
          if (!foodCard) return;
          
          const mealData = extractMealDataFromCard(foodCard);
          eventHandlers.onSuggestedMealDetailsClicked(mealData);
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
        const currentSelected = document.querySelectorAll('.keyword-item.selected').length;
        const isCurrentlySelected = item.classList.contains('selected');
        
        if (!isCurrentlySelected && currentSelected >= 6) {
          alert('Maximum 6 keywords allowed! Please unselect some keywords first.');
          return;
        }
        
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
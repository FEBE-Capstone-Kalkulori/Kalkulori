import HomeView from './home-view';
import mealApiService from '../../utils/meal-api-service';
import { 
  formatMealPlanData, 
  calculateTotalCalories, 
  getDefaultMealPlan 
} from './meal-plan';
import { 
  validateKeywords, 
  countSelectedKeywordsByCategory, 
  groupKeywordsByCategory,
  findCategoryByKeyword 
} from './meal-categories.js';

class HomePresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      currentCalories: 0,
      calorieLimit: 1500,
      selectedKeywords: [],
      dailyLog: null,
      mealEntries: [],
      loading: true,
      error: null,
      currentCategory: null,
      mealPlan: {
        plans: [],
        totalCalories: 0,
        targetCalories: 1500,
        loading: false,
        error: null
      },
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
      ],
      mealSuggestions: {
        loading: false,
        error: null,
        data: [],
        isFromAPI: false
      }
    };
    
    this.eventHandlers = {
      onAddMealClicked: this._handleAddMeal.bind(this),
      onDeleteMealClicked: this._handleDeleteMeal.bind(this),
      onCategoryClicked: this._handleCategoryClicked.bind(this),
      onPopupClosed: this._handlePopupClosed.bind(this),
      onFindMealsClicked: this._handleFindMeals.bind(this),
      onClearAllClicked: this._handleClearAll.bind(this),
      onKeywordRemoved: this._handleKeywordRemoved.bind(this),
      onGenerateMealPlan: this._handleGenerateMealPlan.bind(this),
      onMealPlanItemClicked: this._handleMealPlanItemClicked.bind(this),
      onCompleteProfileClicked: this._handleCompleteProfile.bind(this),
      onSuggestedMealClicked: this._handleSuggestedMealClicked.bind(this),
      onSuggestedMealDetailsClicked: this._handleSuggestedMealDetailsClicked.bind(this)
    };

    this._bindCustomEvents();
  }

  async init() {
    try {
      window.mealApiService = mealApiService;
      
      this.data.loading = true;
      this._renderView();
      
      await this._fetchDailyData();
      await this._fetchMealPlan();
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

  async _fetchMealPlan() {
    try {
      this.data.mealPlan.loading = true;
      this.data.mealPlan.error = null;
      this._renderView();

      console.log('🍽️ Fetching meal plan...');
      const mealPlanData = await mealApiService.generateMealPlan();
      console.log('✅ Meal plan data received:', mealPlanData);
      
      // 🔍 DEBUG: Detailed data inspection
      console.log('🔍 DEBUGGING MEAL PLAN DATA:');
      console.log('  - Full response:', JSON.stringify(mealPlanData, null, 2));
      console.log('  - Has meal_plans?', !!mealPlanData.meal_plans);
      console.log('  - meal_plans type:', typeof mealPlanData.meal_plans);
      console.log('  - meal_plans length:', mealPlanData.meal_plans?.length);
      console.log('  - meal_plans content:', mealPlanData.meal_plans);
      
      if (mealPlanData && mealPlanData.meal_plans && mealPlanData.meal_plans.length > 0) {
        const selectedPlan = mealPlanData.meal_plans[0];
        console.log('🔍 Selected plan (first item):', JSON.stringify(selectedPlan, null, 2));
        
        const formattedPlans = formatMealPlanData(selectedPlan);
        console.log('🔍 Formatted plans result:', JSON.stringify(formattedPlans, null, 2));
        console.log('🔍 Formatted plans length:', formattedPlans.length);
        
        this.data.mealPlan.plans = formattedPlans;
        this.data.mealPlan.totalCalories = calculateTotalCalories(this.data.mealPlan.plans);
        this.data.mealPlan.targetCalories = mealPlanData.user_info?.daily_calorie_target || 1500;
        
        console.log('🔍 Final meal plan state:');
        console.log('  - plans length:', this.data.mealPlan.plans.length);
        console.log('  - totalCalories:', this.data.mealPlan.totalCalories);
        console.log('  - targetCalories:', this.data.mealPlan.targetCalories);
        console.log('  - plans content:', this.data.mealPlan.plans);
        
        console.log('✅ Meal plan formatted successfully');
      } else {
        console.log('⚠️ No meal plans in response, conditions check:');
        console.log('  - mealPlanData exists:', !!mealPlanData);
        console.log('  - meal_plans exists:', !!mealPlanData?.meal_plans);
        console.log('  - meal_plans is array:', Array.isArray(mealPlanData?.meal_plans));
        console.log('  - meal_plans length > 0:', (mealPlanData?.meal_plans?.length || 0) > 0);
        throw new Error('No meal plans available');
      }
      
    } catch (error) {
      console.error('💥 Error fetching meal plan:', error);
      
      let errorMessage = 'Unable to load meal plan';
      
      // Handle specific error cases
      if (error.message.includes('Profile not found') || error.message.includes('404')) {
        errorMessage = 'Please complete your profile first';
        console.log('🔧 Solution: User needs to complete profile');
      } else if (error.message.includes('Daily calorie target') || error.message.includes('400')) {
        errorMessage = 'Please set your daily calorie target in profile';
        console.log('🔧 Solution: User needs to set calorie target');
      } else if (error.message.includes('Server error') || error.message.includes('500')) {
        errorMessage = 'Profile setup required. Please complete your profile.';
        console.log('🔧 Solution: Likely profile or calorie target issue');
      } else if (error.message.includes('503') || error.message.includes('ML service')) {
        errorMessage = 'Meal plan service temporarily unavailable';
        console.log('🔧 Solution: ML service is down');
      } else if (error.message.includes('504') || error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again';
        console.log('🔧 Solution: Timeout, user should retry');
      } else if (error.message.includes('connect') || error.message.includes('network')) {
        errorMessage = 'Connection error. Please check your internet';
        console.log('🔧 Solution: Network connectivity issue');
      } else if (error.message.includes('No meal plans available')) {
        errorMessage = 'No meal plans generated. Please try again.';
        console.log('🔧 Solution: ML service returned empty result');
      }
      
      this.data.mealPlan.error = errorMessage;
      this.data.mealPlan.plans = getDefaultMealPlan();
      this.data.mealPlan.totalCalories = calculateTotalCalories(this.data.mealPlan.plans);
      
      console.log('📋 Using default meal plan as fallback');
      console.log('📋 Default plans:', this.data.mealPlan.plans);
    } finally {
      this.data.mealPlan.loading = false;
      this._renderView();
    }
  }

  _bindCustomEvents() {
    document.addEventListener('keywordToggled', (event) => {
      this._handleKeywordToggled(event.detail.keyword, event.detail.selected);
    });
  }

  _renderView() {
    HomeView.render(this.container, this.data);
    HomeView.afterRender(this.eventHandlers);
  }

  _handleAddMeal() {
    window.location.hash = '#/add-meal';
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

  _handleCategoryClicked(category) {
    console.log(`Category clicked: ${category}`);
    this.data.currentCategory = category;
    
    setTimeout(() => {
      HomeView.showCategoryPopup(category, this.data.selectedKeywords);
    }, 100);
  }

  _handlePopupClosed() {
    console.log('Popup closed');
    this.data.currentCategory = null;
    HomeView.hideCategoryPopup();
    this._renderView();
  }

  _handleKeywordToggled(keyword, selected) {
    console.log(`Keyword ${keyword} ${selected ? 'selected' : 'deselected'}`);
    
    const validKeywords = validateKeywords([keyword]);
    if (validKeywords.length === 0) {
      console.warn(`Invalid keyword: ${keyword}`);
      return;
    }
    
    if (selected) {
      // Check if we already have 6 keywords selected
      if (this.data.selectedKeywords.length >= 6) {
        alert('Maximum 6 keywords allowed! Please remove some keywords first.');
        // Deselect the keyword in UI
        setTimeout(() => {
          const keywordElement = document.querySelector(`[data-keyword="${keyword}"]`);
          if (keywordElement) {
            keywordElement.classList.remove('selected');
          }
        }, 100);
        return;
      }
      
      if (!this.data.selectedKeywords.includes(keyword)) {
        this.data.selectedKeywords.push(keyword);
      }
    } else {
      this.data.selectedKeywords = this.data.selectedKeywords.filter(k => k !== keyword);
    }
    
    const categoryCounts = countSelectedKeywordsByCategory(this.data.selectedKeywords);
    console.log('Selected keywords by category:', categoryCounts);
    console.log('Total selected keywords:', this.data.selectedKeywords);
  }

  async _handleFindMeals() {
    console.log('Finding meals with keywords:', this.data.selectedKeywords);
    
    if (this.data.selectedKeywords.length === 0) {
      alert('Please select some preferences first!');
      return;
    }

    if (this.data.selectedKeywords.length > 6) {
      alert('Maximum 6 keywords allowed! Please remove some keywords first.');
      return;
    }

    try {
      // Set loading state
      this.data.mealSuggestions.loading = true;
      this.data.mealSuggestions.error = null;
      this.data.mealSuggestions.isFromAPI = true;
      this._renderView();

      console.log('🔍 Fetching meal suggestions from API...');
      console.log('Keywords:', this.data.selectedKeywords);

      // Call API for meal suggestions
      const suggestionsData = await mealApiService.getMealSuggestions(this.data.selectedKeywords);
      console.log('✅ Meal suggestions received:', suggestionsData);

      if (suggestionsData && suggestionsData.suggestions && suggestionsData.suggestions.length > 0) {
        // Format suggestions to match foodCard format
        const formattedSuggestions = suggestionsData.suggestions.map(suggestion => ({
          id: suggestion.recipe_id,
          name: suggestion.name,
          calories: suggestion.calories,
          image: suggestion.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          serving_size: suggestion.serving_size || 1,
          serving_unit: suggestion.serving_unit || 'serving',
          protein: suggestion.protein,
          carbohydrate: suggestion.carbohydrate,
          fat: suggestion.fat
        }));

        this.data.mealSuggestions.data = formattedSuggestions;
        this.data.suggestedMeals = formattedSuggestions.slice(0, 8); // Show max 8 items
        
        console.log('✅ Meal suggestions formatted successfully');
        console.log('Total suggestions:', formattedSuggestions.length);
        
        alert(`Found ${formattedSuggestions.length} meal suggestions based on your preferences!`);
      } else {
        console.log('⚠️ No suggestions found, using fallback');
        this._useFallbackSuggestions();
        alert('No specific suggestions found for your keywords. Showing general recommendations.');
      }

    } catch (error) {
      console.error('💥 Error fetching meal suggestions:', error);
      
      let errorMessage = 'Failed to get meal suggestions';
      
      if (error.message.includes('Profile not found') || error.message.includes('404')) {
        errorMessage = 'Please complete your profile first to get personalized suggestions.';
      } else if (error.message.includes('Daily calorie target') || error.message.includes('400')) {
        errorMessage = 'Please set your daily calorie target in profile to get suggestions.';
      } else if (error.message.includes('503') || error.message.includes('service')) {
        errorMessage = 'Meal suggestion service is temporarily unavailable. Using default suggestions.';
      } else if (error.message.includes('504') || error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Using default suggestions.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      this.data.mealSuggestions.error = errorMessage;
      this._useFallbackSuggestions();
      alert(errorMessage);
      
    } finally {
      this.data.mealSuggestions.loading = false;
      this._renderView();
    }
  }

  _useFallbackSuggestions() {
    // Use default suggestions when API fails
    this.data.mealSuggestions.data = [
      {
        id: "default_1",
        name: 'Chicken Soto',
        image: './public/image/meals/chicken-soto.jpg',
        calories: 312,
        serving_size: 1,
        serving_unit: 'serving'
      },
      {
        id: "default_2",
        name: 'Fried Noodles',
        image: './public/image/meals/fried-noodles.jpg',
        calories: 280,
        serving_size: 1,
        serving_unit: 'serving'
      },
      {
        id: "default_3",
        name: 'Meatballs Soup',
        image: './public/image/meals/meatballs-soup.jpg',
        calories: 283,
        serving_size: 1,
        serving_unit: 'serving'
      },
      {
        id: "default_4",
        name: 'Noodles Soup',
        image: './public/image/meals/noodles-soup.jpg',
        calories: 137,
        serving_size: 1,
        serving_unit: 'serving'
      }
    ];
    
    this.data.suggestedMeals = this.data.mealSuggestions.data;
    this.data.mealSuggestions.isFromAPI = false;
  }

  _handleClearAll() {
    console.log('Clearing all selected keywords');
    this.data.selectedKeywords = [];
    
    // Reset to default suggestions
    this._useFallbackSuggestions();
    this.data.mealSuggestions.loading = false;
    this.data.mealSuggestions.error = null;
    this.data.mealSuggestions.isFromAPI = false;
    
    this._renderView();
  }

  _handleKeywordRemoved(keyword) {
    console.log(`Removing keyword: ${keyword}`);
    this.data.selectedKeywords = this.data.selectedKeywords.filter(k => k !== keyword);
    
    const categoryCounts = countSelectedKeywordsByCategory(this.data.selectedKeywords);
    console.log('Updated keywords by category:', categoryCounts);
    
    this._renderView();
  }

  async _handleGenerateMealPlan() {
    await this._fetchMealPlan();
  }

  _handleMealPlanItemClicked(mealData) {
    console.log('Meal plan item clicked:', mealData);
    
    if (window.FoodCard && window.FoodCard.showAddMealPopup) {
      window.FoodCard.showAddMealPopup({
        id: mealData.id,
        name: mealData.name,
        calories: mealData.calories,
        serving_size: mealData.serving_size,
        serving_unit: mealData.serving_unit
      });
    }
  }

  _handleCompleteProfile() {
    console.log('Complete profile clicked');
    window.location.hash = '#/profile';
  }

  _handleSuggestedMealClicked(mealData) {
    console.log('Suggested meal clicked for adding:', mealData);
    
    if (window.FoodCard && window.FoodCard.showAddMealPopup) {
      window.FoodCard.showAddMealPopup({
        id: mealData.id,
        name: mealData.name,
        calories: mealData.calories,
        serving_size: mealData.serving_size || 1,
        serving_unit: mealData.serving_unit || 'serving'
      });
    }
  }

  async _handleSuggestedMealDetailsClicked(mealData) {
    console.log('Suggested meal details clicked:', mealData);
    
    if (!mealData.id || mealData.id.startsWith('default_')) {
      // For default meals, show basic info
      this._showMealDetailsPopup({
        name: mealData.name,
        calories: mealData.calories,
        image: mealData.image,
        serving_size: mealData.serving_size || 1,
        serving_unit: mealData.serving_unit || 'serving',
        protein: mealData.protein || 0,
        carbohydrate: mealData.carbohydrate || 0,
        fat: mealData.fat || 0,
        isDefault: true
      });
      return;
    }

    try {
      console.log('🔍 Fetching meal details from API...');
      
      // Show loading state
      this._showMealDetailsPopup({
        name: mealData.name,
        loading: true
      });

      const mealDetails = await mealApiService.getMealDetails(mealData.id);
      console.log('✅ Meal details received:', mealDetails);

      if (mealDetails && mealDetails.meal) {
        const meal = mealDetails.meal;
        this._showMealDetailsPopup({
          name: meal.food_name,
          calories: meal.calories_per_serving,
          image: meal.image_url,
          serving_size: meal.serving_size,
          serving_unit: meal.serving_unit,
          protein: meal.protein_per_serving,
          carbohydrate: meal.carbs_per_serving,
          fat: meal.fat_per_serving,
          cookTime: meal.recipe_metadata?.cook_time,
          prepTime: meal.recipe_metadata?.prep_time,
          totalTime: meal.recipe_metadata?.total_time,
          ingredients: meal.recipe_metadata?.ingredients,
          nutrition: meal.recipe_metadata?.total_nutrition,
          isDefault: false
        });
      } else {
        throw new Error('No meal details found');
      }

    } catch (error) {
      console.error('💥 Error fetching meal details:', error);
      
      // Show error in popup
      this._showMealDetailsPopup({
        name: mealData.name,
        error: 'Failed to load meal details. Please try again.',
        calories: mealData.calories,
        image: mealData.image
      });
    }
  }

  _showMealDetailsPopup(mealDetails) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('meal-details-popup-overlay');
    if (existingPopup) {
      existingPopup.remove();
    }

    let popupContent = '';
    
    if (mealDetails.loading) {
      popupContent = `
        <div class="meal-details-loading">
          <div class="loading-spinner"></div>
          <p>Loading meal details...</p>
        </div>
      `;
    } else if (mealDetails.error) {
      popupContent = `
        <div class="meal-details-error">
          <h4>Error</h4>
          <p>${mealDetails.error}</p>
          <div class="basic-meal-info">
            <img src="${mealDetails.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222'}" alt="${mealDetails.name}">
            <h3>${mealDetails.name}</h3>
            <p>${mealDetails.calories || 0} kcal per serving</p>
          </div>
        </div>
      `;
    } else {
      popupContent = `
        <div class="meal-details-content">
          <div class="meal-details-header">
            <img src="${mealDetails.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222'}" alt="${mealDetails.name}">
            <div class="meal-basic-info">
              <h3>${mealDetails.name}</h3>
              <p class="meal-calories">${mealDetails.calories} kcal per ${mealDetails.serving_unit || 'serving'}</p>
              ${mealDetails.totalTime ? `<p class="meal-time">⏱️ ${mealDetails.totalTime} minutes</p>` : ''}
            </div>
          </div>
          
          <div class="meal-nutrition">
            <h4>Nutrition per serving:</h4>
            <div class="nutrition-grid">
              <div class="nutrition-item">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">${Math.round(mealDetails.protein || 0)}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">Carbs</span>
                <span class="nutrition-value">${Math.round(mealDetails.carbohydrate || 0)}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">Fat</span>
                <span class="nutrition-value">${Math.round(mealDetails.fat || 0)}g</span>
              </div>
            </div>
          </div>

          ${mealDetails.ingredients && mealDetails.ingredients.length > 0 ? `
            <div class="meal-ingredients">
              <h4>Ingredients:</h4>
              <ul>
                ${mealDetails.ingredients.slice(0, 10).map(ingredient => `<li>${ingredient}</li>`).join('')}
                ${mealDetails.ingredients.length > 10 ? `<li><em>... and ${mealDetails.ingredients.length - 10} more ingredients</em></li>` : ''}
              </ul>
            </div>
          ` : ''}

          ${mealDetails.nutrition ? `
            <div class="detailed-nutrition">
              <h4>Detailed Nutrition:</h4>
              <div class="nutrition-details-grid">
                ${mealDetails.nutrition.fiber ? `<div>Fiber: ${Math.round(mealDetails.nutrition.fiber)}g</div>` : ''}
                ${mealDetails.nutrition.sugar ? `<div>Sugar: ${Math.round(mealDetails.nutrition.sugar)}g</div>` : ''}
                ${mealDetails.nutrition.sodium ? `<div>Sodium: ${Math.round(mealDetails.nutrition.sodium)}mg</div>` : ''}
                ${mealDetails.nutrition.cholesterol ? `<div>Cholesterol: ${Math.round(mealDetails.nutrition.cholesterol)}mg</div>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    const popupHTML = `
      <div class="meal-details-popup-overlay" id="meal-details-popup-overlay">
        <div class="meal-details-popup">
          <div class="meal-details-popup-header">
            <h2>Meal Details</h2>
            <button class="popup-close" id="meal-details-close">&times;</button>
          </div>
          <div class="meal-details-popup-body">
            ${popupContent}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Add event listeners
    const overlay = document.getElementById('meal-details-popup-overlay');
    const closeBtn = document.getElementById('meal-details-close');

    const closePopup = () => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
      });
    }

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
}

export default HomePresenter;
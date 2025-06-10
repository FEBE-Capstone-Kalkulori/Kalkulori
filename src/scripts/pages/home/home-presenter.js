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
    this.lastFetchDate = null;
    this.data = {
      currentCalories: 0,
      calorieLimit: null,
      selectedKeywords: [],
      dailyLog: null,
      mealEntries: [],
      loading: true,
      error: null,
      currentCategory: null,
      mealPlan: {
        plans: [],
        totalCalories: 0,
        targetCalories: null,
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
    this._startDayChangeMonitor();
  }

  async init() {
    try {
      window.mealApiService = mealApiService;
      
      this._checkAndResetForNewDay();
      
      this.data.loading = true;
      this._renderView();
      
      console.log('🚀 Starting app initialization...');
      
      await this._fetchUserProfile();
      
      console.log('✅ Profile fetch complete, calorieLimit:', this.data.calorieLimit);
      
      this._loadFromSessionStorage();
      
      await this._fetchDailyData();
      await this._fetchMealPlan();
    } catch (error) {
      console.error('Failed to initialize Home page:', error);
      this.data.error = 'Failed to load daily data';
      this.data.loading = false;
      this._renderView();
    }
  }

  _getCurrentUserId() {
    return localStorage.getItem('userId') || 'anonymous';
  }

  _startDayChangeMonitor() {
    setInterval(() => {
      this._checkAndResetForNewDay();
    }, 60000);
  }

  _checkAndResetForNewDay() {
    const today = this._getTodayString();
    const userId = this._getCurrentUserId();
    const lastDateKey = `lastAppDate_${userId}`;
    const lastDate = localStorage.getItem(lastDateKey);
    
    if (lastDate !== today) {
      console.log('New day detected, resetting data for user:', userId);
      
      localStorage.setItem(lastDateKey, today);
      
      const keysToRemove = [
        `mealSuggestions_${userId}`,
        `dailyLogs_${userId}`,
        `mealPlan_${userId}`
      ];
      
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      this.data.selectedKeywords = [];
      this.data.mealSuggestions = {
        loading: false,
        error: null,
        data: [],
        isFromAPI: false
      };
      this.data.suggestedMeals = [
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
      ];
      
      this.data.currentCalories = 0;
      this.data.mealEntries = [];
      this.data.dailyLog = null;
      this.data.mealPlan = {
        plans: [],
        totalCalories: 0,
        targetCalories: 2000,
        loading: false,
        error: null
      };
      this.lastFetchDate = null;
      
      if (this.container && this.container.innerHTML) {
        this._fetchUserProfile();
        this._fetchDailyData();
        this._fetchMealPlan();
      }
    }
  }

  _getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  _saveToSessionStorage() {
    const today = this._getTodayString();
    const userId = this._getCurrentUserId();
    
    const mealSuggestionsData = {
      date: today,
      userId: userId,
      selectedKeywords: this.data.selectedKeywords,
      mealSuggestions: {
        loading: false,
        error: this.data.mealSuggestions.error,
        data: this.data.mealSuggestions.data,
        isFromAPI: this.data.mealSuggestions.isFromAPI
      },
      suggestedMeals: this.data.suggestedMeals
    };
    sessionStorage.setItem(`mealSuggestions_${userId}`, JSON.stringify(mealSuggestionsData));

    const dailyLogsData = {
      date: today,
      userId: userId,
      currentCalories: this.data.currentCalories,
      calorieLimit: this.data.calorieLimit,
      dailyLog: this.data.dailyLog,
      mealEntries: this.data.mealEntries,
      lastFetchDate: this.lastFetchDate
    };
    sessionStorage.setItem(`dailyLogs_${userId}`, JSON.stringify(dailyLogsData));

    const mealPlanData = {
      date: today,
      userId: userId,
      mealPlan: this.data.mealPlan
    };
    sessionStorage.setItem(`mealPlan_${userId}`, JSON.stringify(mealPlanData));
  }

  _loadFromSessionStorage() {
    const today = this._getTodayString();
    const userId = this._getCurrentUserId();
    
    try {
      const mealSuggestionsStored = sessionStorage.getItem(`mealSuggestions_${userId}`);
      if (mealSuggestionsStored) {
        const sessionData = JSON.parse(mealSuggestionsStored);
        if (sessionData.date === today && sessionData.userId === userId) {
          this.data.selectedKeywords = sessionData.selectedKeywords || [];
          this.data.mealSuggestions = {
            loading: false,
            error: null,
            data: sessionData.mealSuggestions?.data || [],
            isFromAPI: sessionData.mealSuggestions?.isFromAPI || false
          };
          this.data.suggestedMeals = sessionData.suggestedMeals || this.data.suggestedMeals;
          console.log('Restored meal suggestions from session storage for user:', userId);
        } else {
          sessionStorage.removeItem(`mealSuggestions_${userId}`);
        }
      }

      const dailyLogsStored = sessionStorage.getItem(`dailyLogs_${userId}`);
      if (dailyLogsStored) {
        const dailyData = JSON.parse(dailyLogsStored);
        if (dailyData.date === today && dailyData.userId === userId) {
          this.data.currentCalories = dailyData.currentCalories || 0;
          if (dailyData.calorieLimit && !this.data.calorieLimit) {
            this.data.calorieLimit = dailyData.calorieLimit;
          }
          this.data.dailyLog = dailyData.dailyLog;
          this.data.mealEntries = dailyData.mealEntries || [];
          this.lastFetchDate = dailyData.lastFetchDate;
          console.log('Restored daily logs from session storage for user:', userId);
        } else {
          sessionStorage.removeItem(`dailyLogs_${userId}`);
        }
      }

      const mealPlanStored = sessionStorage.getItem(`mealPlan_${userId}`);
      if (mealPlanStored) {
        const planData = JSON.parse(mealPlanStored);
        if (planData.date === today && planData.userId === userId && planData.mealPlan) {
          this.data.mealPlan = planData.mealPlan;
          console.log('Restored meal plan from session storage for user:', userId);
        } else {
          sessionStorage.removeItem(`mealPlan_${userId}`);
        }
      }
    } catch (error) {
      console.error('Error loading from session storage:', error);
      sessionStorage.removeItem(`mealSuggestions_${userId}`);
      sessionStorage.removeItem(`dailyLogs_${userId}`);
      sessionStorage.removeItem(`mealPlan_${userId}`);
    }
  }

  async _fetchUserProfile() {
    try {
      console.log('🔄 Fetching user profile...');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ No auth token found');
        this.data.calorieLimit = 2000;
        return;
      }

      console.log('🔑 Auth token found, calling profile API...');

      const response = await fetch('https://kalkulori.up.railway.app/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Profile API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📋 Profile API result:', result);
        
        if (result.status === 'success' && result.data && result.data.profile) {
          const profile = result.data.profile;
          if (profile.daily_calorie_target) {
            this.data.calorieLimit = profile.daily_calorie_target;
            console.log('✅ Daily calorie target set:', this.data.calorieLimit);
            return;
          }
        }
      }

      console.log('⚠️ Profile API failed or missing data, using fallback');
      this.data.calorieLimit = 2000;

    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      this.data.calorieLimit = 2000;
    }
  }

  async _fetchDailyData(forceRefresh = false) {
    try {
      const today = this._getTodayString();
      const userId = this._getCurrentUserId();
      
      if (!forceRefresh && this.lastFetchDate === today && this.data.mealEntries.length > 0) {
        this.data.loading = false;
        this._renderView();
        return;
      }
      
      const response = await fetch(`https://kalkulori.up.railway.app/api/logs/${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      let dailyData;
      if (response.status === 404) {
        dailyData = {
          daily_log: {
            total_calories_consumed: 0,
            total_protein_consumed: 0,
            total_carbs_consumed: 0,
            total_fat_consumed: 0,
            remaining_calories: this.data.calorieLimit || 2000
          },
          meal_entries: []
        };
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const result = await response.json();
        if (result.status === 'success') {
          dailyData = result.data;
        } else {
          throw new Error(result.message || 'Failed to fetch daily data');
        }
      }
      
      this.data.dailyLog = dailyData.daily_log;
      
      console.log('📊 Raw meal entries from API for user', userId, ':', dailyData.meal_entries);
      
      if (dailyData.meal_entries && dailyData.meal_entries.length > 0) {
        dailyData.meal_entries.forEach((meal, index) => {
          console.log(`📋 Meal ${index + 1}:`, {
            id: meal.id,
            food_item_id: meal.food_item_id,
            food_name: meal.food_name,
            is_from_search: meal.is_from_search,
            is_from_recipe: meal.is_from_recipe,
            recipe_id: meal.recipe_id,
            meal_type: meal.meal_type,
            servings: meal.servings,
            calories: meal.calories || meal.calories_consumed
          });
        });
      }
      
      this.data.mealEntries = await this._enrichMealEntries(dailyData.meal_entries || []);
      
      console.log('✨ Enriched meal entries for user', userId, ':', this.data.mealEntries);
      
      this.data.currentCalories = dailyData.daily_log.total_calories_consumed || 0;
      
      if (dailyData.daily_log.remaining_calories !== undefined && !this.data.calorieLimit) {
        this.data.calorieLimit = this.data.currentCalories + dailyData.daily_log.remaining_calories;
      }
      
      this.lastFetchDate = today;
      this._saveToSessionStorage();
      
    } catch (error) {
      console.error('Error fetching daily data for user', this._getCurrentUserId(), ':', error);
      this.data.error = 'Unable to load today\'s data';
      this.data.currentCalories = 0;
      this.data.mealEntries = [];
      this.data.dailyLog = null;
    } finally {
      this.data.loading = false;
      this._renderView();
    }
  }

  async _enrichMealEntries(mealEntries) {
    const enrichedEntries = [];
    
    for (const meal of mealEntries) {
      let enrichedMeal = { ...meal };
      
      const originalMealId = meal.id;
      
      if (!enrichedMeal.calories && enrichedMeal.calories_consumed) {
        enrichedMeal.calories = enrichedMeal.calories_consumed;
      }
      if (!enrichedMeal.protein && enrichedMeal.protein_consumed) {
        enrichedMeal.protein = enrichedMeal.protein_consumed;
      }
      if (!enrichedMeal.carbs && enrichedMeal.carbs_consumed) {
        enrichedMeal.carbs = enrichedMeal.carbs_consumed;
      }
      if (!enrichedMeal.fat && enrichedMeal.fat_consumed) {
        enrichedMeal.fat = enrichedMeal.fat_consumed;
      }
      
      console.log(`🔍 Processing meal entry:`, {
        id: meal.id,
        food_item_id: meal.food_item_id,
        is_from_search: meal.is_from_search,
        is_from_recipe: meal.is_from_recipe,
        recipe_id: meal.recipe_id,
        food_name: meal.food_name
      });
      
      if (meal.is_from_search && meal.recipe_id) {
        console.log(`🔍 Processing search meal with recipe_id: ${meal.recipe_id}, meal_id: ${meal.id}`);
        try {
          const mealDetails = await mealApiService.getMealDetails(meal.recipe_id);
          if (mealDetails && mealDetails.meal) {
            const recipeData = mealDetails.meal;
            enrichedMeal.food_details = {
              id: meal.food_item_id,
              food_name: recipeData.food_name || meal.food_name || 'Search Result',
              calories_per_serving: recipeData.calories_per_serving,
              protein_per_serving: recipeData.protein_per_serving,
              carbs_per_serving: recipeData.carbs_per_serving,
              fat_per_serving: recipeData.fat_per_serving,
              serving_size: recipeData.serving_size,
              serving_unit: recipeData.serving_unit,
              image_url: recipeData.image_url,
              is_from_search: true,
              recipe_id: meal.recipe_id
            };
            console.log(`✅ Successfully enriched search meal:`, enrichedMeal.food_details.food_name);
          } else {
            throw new Error('No meal details found');
          }
        } catch (error) {
          console.warn(`Could not fetch search meal details:`, error);
          
          const caloriesPerServing = Math.round((meal.calories || meal.calories_consumed || 0) / (meal.servings || 1));
          const proteinPerServing = parseFloat(((meal.protein || meal.protein_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const carbsPerServing = parseFloat(((meal.carbs || meal.carbs_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const fatPerServing = parseFloat(((meal.fat || meal.fat_consumed || 0) / (meal.servings || 1)).toFixed(2));
          
          enrichedMeal.food_details = {
            id: meal.food_item_id,
            food_name: meal.food_name || 'Search Result',
            calories_per_serving: caloriesPerServing,
            protein_per_serving: proteinPerServing,
            carbs_per_serving: carbsPerServing,
            fat_per_serving: fatPerServing,
            serving_size: 1,
            serving_unit: "serving",
            image_url: null,
            is_from_search: true,
            recipe_id: meal.recipe_id
          };
          console.log(`⚠️ Using fallback data for search meal:`, enrichedMeal.food_details.food_name);
        }
      }
      else if (meal.is_from_recipe && meal.recipe_id) {
        console.log(`🍽️ Processing recipe meal with recipe_id: ${meal.recipe_id}, meal_id: ${meal.id}`);
        try {
          const mealDetails = await mealApiService.getMealDetails(meal.recipe_id);
          if (mealDetails && mealDetails.meal) {
            const recipeData = mealDetails.meal;
            enrichedMeal.food_details = {
              id: `recipe_${meal.recipe_id}`,
              food_name: recipeData.food_name || meal.food_name || 'Recipe Meal',
              calories_per_serving: recipeData.calories_per_serving,
              protein_per_serving: recipeData.protein_per_serving,
              carbs_per_serving: recipeData.carbs_per_serving,
              fat_per_serving: recipeData.fat_per_serving,
              serving_size: recipeData.serving_size,
              serving_unit: recipeData.serving_unit,
              image_url: recipeData.image_url,
              is_recipe: true,
              recipe_id: meal.recipe_id
            };
            console.log(`✅ Successfully enriched recipe meal:`, enrichedMeal.food_details.food_name);
          } else {
            throw new Error('No meal details found');
          }
        } catch (error) {
          console.warn(`Could not fetch recipe meal details:`, error);
          
          const caloriesPerServing = Math.round((meal.calories || meal.calories_consumed || 0) / (meal.servings || 1));
          const proteinPerServing = parseFloat(((meal.protein || meal.protein_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const carbsPerServing = parseFloat(((meal.carbs || meal.carbs_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const fatPerServing = parseFloat(((meal.fat || meal.fat_consumed || 0) / (meal.servings || 1)).toFixed(2));
          
          enrichedMeal.food_details = {
            id: meal.food_item_id,
            food_name: meal.food_name || 'Recipe Meal',
            calories_per_serving: caloriesPerServing,
            protein_per_serving: proteinPerServing,
            carbs_per_serving: carbsPerServing,
            fat_per_serving: fatPerServing,
            serving_size: 1,
            serving_unit: "serving",
            image_url: null,
            is_recipe: true,
            recipe_id: meal.recipe_id
          };
          console.log(`⚠️ Using fallback data for recipe meal:`, enrichedMeal.food_details.food_name);
        }
      }
      else if (meal.food_details) {
        enrichedMeal.food_details = meal.food_details;
        console.log(`📋 Using existing food_details for meal:`, meal.food_details.food_name);
      }
      else {
        const caloriesPerServing = Math.round((meal.calories || meal.calories_consumed || 0) / (meal.servings || 1));
        const proteinPerServing = parseFloat(((meal.protein || meal.protein_consumed || 0) / (meal.servings || 1)).toFixed(2));
        const carbsPerServing = parseFloat(((meal.carbs || meal.carbs_consumed || 0) / (meal.servings || 1)).toFixed(2));
        const fatPerServing = parseFloat(((meal.fat || meal.fat_consumed || 0) / (meal.servings || 1)).toFixed(2));
        
        enrichedMeal.food_details = {
          id: meal.food_item_id,
          food_name: meal.food_name || 'Unknown Food',
          calories_per_serving: caloriesPerServing,
          protein_per_serving: proteinPerServing,
          carbs_per_serving: carbsPerServing,
          fat_per_serving: fatPerServing,
          serving_size: 1,
          serving_unit: "serving",
          image_url: null
        };
        console.log(`🆕 Created food_details for regular meal:`, enrichedMeal.food_details.food_name);
      }
      
      enrichedMeal.id = originalMealId;
      console.log(`✅ Final meal entry ID: ${enrichedMeal.id} for ${enrichedMeal.food_details?.food_name}`);
      
      enrichedMeal._debug_info = {
        original_id: originalMealId,
        user_id: meal.user_id,
        is_from_recipe: meal.is_from_recipe,
        is_from_search: meal.is_from_search,
        recipe_id: meal.recipe_id,
        food_item_id: meal.food_item_id
      };
      
      enrichedEntries.push(enrichedMeal);
    }
    
    return enrichedEntries;
  }

  async _fetchMealPlan(forceRefresh = false) {
    try {
      const today = this._getTodayString();
      const userId = this._getCurrentUserId();
      const hasCachedPlan = this.data.mealPlan.plans && this.data.mealPlan.plans.length > 0;
      
      if (!forceRefresh && hasCachedPlan) {
        console.log('🍽️ Using cached meal plan for user:', userId);
        return;
      }

      this.data.mealPlan.loading = true;
      this.data.mealPlan.error = null;
      this._renderView();

      console.log('🍽️ Fetching meal plan for user:', userId);
      const mealPlanData = await mealApiService.generateMealPlan();
      console.log('✅ Meal plan data received for user', userId, ':', mealPlanData);
      
      const formattedPlans = formatMealPlanData(mealPlanData);
      
      if (!Array.isArray(formattedPlans) || formattedPlans.length === 0) {
        console.error('❌ formatMealPlanData returned invalid data:', formattedPlans);
        throw new Error('Failed to format meal plan data');
      }
      
      this.data.mealPlan.plans = formattedPlans;
      this.data.mealPlan.totalCalories = calculateTotalCalories(this.data.mealPlan.plans);
      this.data.mealPlan.targetCalories = mealPlanData.user_info?.daily_calorie_target || this.data.calorieLimit;
      
      this._saveToSessionStorage();
      console.log('✅ Meal plan formatted successfully for user:', userId);
      
    } catch (error) {
      console.error('💥 Error fetching meal plan for user', this._getCurrentUserId(), ':', error);
      
      let errorMessage = 'Unable to load meal plan';
      
      if (error.message.includes('Authentication') || error.message.includes('login')) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error.message.includes('Profile not found') || error.message.includes('404')) {
        errorMessage = 'Please complete your profile first';
      } else if (error.message.includes('Daily calorie target') || error.message.includes('400')) {
        errorMessage = 'Please set your daily calorie target in profile';
      } else if (error.message.includes('Server error') || error.message.includes('500')) {
        errorMessage = 'Profile setup required. Please complete your profile.';
      } else if (error.message.includes('503') || error.message.includes('ML service')) {
        errorMessage = 'Meal plan service temporarily unavailable';
      } else if (error.message.includes('504') || error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again';
      } else if (error.message.includes('connect') || error.message.includes('network') || error.message.includes('Network error')) {
        errorMessage = 'Connection error. Please check your internet';
      } else if (error.message.includes('No meal plans available') || error.message.includes('No meal plans generated')) {
        errorMessage = 'No meal plans generated. Please try again.';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'Invalid data received. Please try again.';
      }
      
      this.data.mealPlan.error = errorMessage;
      
      if (!error.message.includes('Authentication') && !error.message.includes('login')) {
        this.data.mealPlan.plans = getDefaultMealPlan();
        this.data.mealPlan.totalCalories = calculateTotalCalories(this.data.mealPlan.plans);
        console.log('📋 Using default meal plan as fallback for user:', this._getCurrentUserId());
      } else {
        this.data.mealPlan.plans = [];
        this.data.mealPlan.totalCalories = 0;
      }
      
    } finally {
      this.data.mealPlan.loading = false;
      this._renderView();
    }
  }

  _bindCustomEvents() {
    document.addEventListener('keywordToggled', (event) => {
      this._handleKeywordToggled(event.detail.keyword, event.detail.selected);
    });

    document.addEventListener('mealPlanMealAdded', () => {
      console.log('🔄 Meal plan meal added, refreshing data for user:', this._getCurrentUserId());
      this._refreshDailyData();
    });

    document.addEventListener('mealAdded', (event) => {
      console.log('🔄 Meal added from', event.detail.source, ', refreshing data for user:', this._getCurrentUserId());
      setTimeout(() => {
        this._refreshDailyData();
      }, 500);
    });
  }

  async _refreshDailyData() {
    try {
      await this._fetchUserProfile();
      await this._fetchDailyData(true);
    } catch (error) {
      console.error('Error refreshing daily data for user', this._getCurrentUserId(), ':', error);
    }
  }

  _renderView() {
    HomeView.render(this.container, this.data);
    HomeView.afterRender(this.eventHandlers);
    
    const deleteMealButtons = document.querySelectorAll('.delete-meal-btn');
    deleteMealButtons.forEach(button => {
      const mealId = button.dataset.mealId;
      console.log('🔍 Delete button found for meal ID:', mealId);
    });
  }

  _handleAddMeal() {
    window.location.hash = '#/add-meal';
  }

  async _handleDeleteMeal(mealId) {
    try {
      console.log('🗑️ Attempting to delete meal with ID:', mealId);
      console.log('🗑️ Meal ID type:', typeof mealId);
      
      if (!mealId || mealId === 'undefined' || mealId === 'null') {
        console.error('❌ Invalid meal ID provided:', mealId);
        alert('Cannot delete this meal. Invalid meal ID.');
        return;
      }
      
      const mealToDelete = this.data.mealEntries.find(meal => meal.id === mealId);
      console.log('🔍 Found meal to delete:', mealToDelete);
      
      if (mealToDelete) {
        console.log('📋 Meal details:', {
          id: mealToDelete.id,
          user_id: mealToDelete.user_id,
          is_from_search: mealToDelete.is_from_search,
          is_from_recipe: mealToDelete.is_from_recipe,
          food_item_id: mealToDelete.food_item_id,
          recipe_id: mealToDelete.recipe_id
        });
        
        if (mealToDelete.is_from_search && !mealToDelete.user_id) {
          console.warn('⚠️ Search meal detected without user_id, this may cause delete issues');
        }
      }
      
      this.data.loading = true;
      this._renderView();
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('🔗 Making DELETE request to:', `/api/meals/${mealId}`);
      
      const response = await fetch(`https://kalkulori.up.railway.app/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);

      if (response.status === 403) {
        console.error('❌ 403 Forbidden - checking if this is a search meal issue');
        
        if (mealToDelete && mealToDelete.is_from_search) {
          console.log('🔍 This is a search meal, trying alternative approach...');
          
          try {
            await this._handleSearchMealDelete(mealId, mealToDelete);
            return;
          } catch (altError) {
            console.error('❌ Alternative delete method also failed:', altError);
            throw new Error('Cannot delete search meals due to system limitations. Please contact support.');
          }
        } else {
          const errorText = await response.text();
          throw new Error(`Access denied: ${errorText}`);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete failed with response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      let result;
      try {
        result = await response.json();
        console.log('✅ Delete response JSON:', result);
      } catch (parseError) {
        console.log('⚠️ Could not parse response as JSON, assuming success');
        result = { status: 'success' };
      }
      
      if (result.status === 'success' || response.ok) {
        console.log('✅ Meal deleted successfully');
        alert('Meal removed successfully!');
        await this._refreshDailyData();
      } else {
        throw new Error(result.message || 'Failed to delete meal');
      }
      
    } catch (error) {
      console.error('💥 Delete failed for user', this._getCurrentUserId(), ':', error);
      alert(`Failed to delete meal: ${error.message}`);
    } finally {
      this.data.loading = false;
      this._renderView();
    }
  }

  async _handleSearchMealDelete(mealId, mealData) {
    console.log('🔄 Removing search meal locally');
    
    try {
      this.data.mealEntries = this.data.mealEntries.filter(meal => meal.id !== mealId);
      
      this.data.currentCalories = this.data.mealEntries.reduce((total, meal) => {
        return total + (meal.calories || meal.calories_consumed || 0);
      }, 0);
      
      console.log('✅ Updated calories:', this.data.currentCalories);
      console.log('✅ Calorie limit:', this.data.calorieLimit);
      
      this._saveToSessionStorage();
      this._renderView();
      
      alert('Meal removed successfully!');
      
    } catch (error) {
      console.error('❌ Local delete failed:', error);
      throw error;
    }
  }

  _handleCategoryClicked(category) {
    console.log(`Category clicked by user ${this._getCurrentUserId()}: ${category}`);
    this.data.currentCategory = category;
    
    setTimeout(() => {
      HomeView.showCategoryPopup(category, this.data.selectedKeywords);
    }, 100);
  }

  _handlePopupClosed() {
    console.log('Popup closed for user:', this._getCurrentUserId());
    this.data.currentCategory = null;
    HomeView.hideCategoryPopup();
    this._renderView();
  }

  _handleKeywordToggled(keyword, selected) {
    console.log(`User ${this._getCurrentUserId()} keyword ${keyword} ${selected ? 'selected' : 'deselected'}`);
    
    const validKeywords = validateKeywords([keyword]);
    if (validKeywords.length === 0) {
      console.warn(`Invalid keyword: ${keyword}`);
      return;
    }
    
    if (selected) {
      if (this.data.selectedKeywords.length >= 6) {
        alert('Maximum 6 keywords allowed! Please remove some keywords first.');
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
    
    this._saveToSessionStorage();
    
    const categoryCounts = countSelectedKeywordsByCategory(this.data.selectedKeywords);
    console.log('Selected keywords by category for user', this._getCurrentUserId(), ':', categoryCounts);
    console.log('Total selected keywords for user', this._getCurrentUserId(), ':', this.data.selectedKeywords);
  }

  async _handleFindMeals() {
    console.log('Finding meals with keywords for user', this._getCurrentUserId(), ':', this.data.selectedKeywords);
    
    if (this.data.selectedKeywords.length === 0) {
      alert('Please select some preferences first!');
      return;
    }

    if (this.data.selectedKeywords.length > 6) {
      alert('Maximum 6 keywords allowed! Please remove some keywords first.');
      return;
    }

    try {
      this.data.mealSuggestions.loading = true;
      this.data.mealSuggestions.error = null;
      this.data.mealSuggestions.isFromAPI = true;
      this._renderView();

      console.log('🔍 Fetching meal suggestions from API for user:', this._getCurrentUserId());
      console.log('Keywords:', this.data.selectedKeywords);

      const suggestionsData = await mealApiService.getMealSuggestions(this.data.selectedKeywords);
      console.log('✅ Meal suggestions received for user', this._getCurrentUserId(), ':', suggestionsData);

      if (suggestionsData && suggestionsData.suggestions && suggestionsData.suggestions.length > 0) {
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
        this.data.suggestedMeals = formattedSuggestions.slice(0, 8);
        this.data.mealSuggestions.loading = false;
        this.data.mealSuggestions.error = null;
        this.data.mealSuggestions.isFromAPI = true;
        
        this._saveToSessionStorage();
        
        console.log('✅ Meal suggestions formatted successfully for user:', this._getCurrentUserId());
        console.log('Total suggestions:', formattedSuggestions.length);
        
        alert(`Found ${formattedSuggestions.length} meal suggestions based on your preferences!`);
      } else {
        console.log('⚠️ No suggestions found for user', this._getCurrentUserId(), ', using fallback');
        this._useFallbackSuggestions();
        alert('No specific suggestions found for your keywords. Showing general recommendations.');
      }

    } catch (error) {
      console.error('💥 Error fetching meal suggestions for user', this._getCurrentUserId(), ':', error);
      
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
      this._saveToSessionStorage();
      this._renderView();
    }
  }

  _useFallbackSuggestions() {
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
    this.data.mealSuggestions.loading = false;
    this.data.mealSuggestions.error = null;
    this.data.mealSuggestions.isFromAPI = false;
    this._saveToSessionStorage();
  }

  _handleClearAll() {
    console.log('Clearing all selected keywords for user:', this._getCurrentUserId());
    this.data.selectedKeywords = [];
    
    this._useFallbackSuggestions();
    this.data.mealSuggestions.loading = false;
    this.data.mealSuggestions.error = null;
    this.data.mealSuggestions.isFromAPI = false;
    
    this._saveToSessionStorage();
    this._renderView();
  }

  _handleKeywordRemoved(keyword) {
    console.log(`User ${this._getCurrentUserId()} removing keyword: ${keyword}`);
    this.data.selectedKeywords = this.data.selectedKeywords.filter(k => k !== keyword);
    
    this._saveToSessionStorage();
    
    const categoryCounts = countSelectedKeywordsByCategory(this.data.selectedKeywords);
    console.log('Updated keywords by category for user', this._getCurrentUserId(), ':', categoryCounts);
    
    this._renderView();
  }

  async _handleGenerateMealPlan() {
    await this._fetchMealPlan(true);
  }

  _handleMealPlanItemClicked(mealData) {
    console.log('Meal plan item clicked by user', this._getCurrentUserId(), ':', mealData);
    
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
    console.log('Complete profile clicked by user:', this._getCurrentUserId());
    window.location.hash = '#/profile';
  }

  _handleSuggestedMealClicked(mealData) {
    console.log('Suggested meal clicked for adding by user', this._getCurrentUserId(), ':', mealData);
    
    this._showSuggestionMealPopup({
      id: mealData.id,
      name: mealData.name,
      calories: mealData.calories,
      serving_size: mealData.serving_size || 1,
      serving_unit: mealData.serving_unit || 'serving'
    });
  }

  _showSuggestionMealPopup(foodData) {
    console.log('Showing suggestion meal popup for user', this._getCurrentUserId(), ':', foodData);
    
    const existingPopup = document.getElementById('suggestion-meal-popup-overlay');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    const popupHTML = `
      <div class="meal-popup-overlay" id="suggestion-meal-popup-overlay">
        <div class="meal-popup">
          <div class="meal-popup-header">
            <h3>Add ${foodData.name}</h3>
            <button class="popup-close" id="suggestion-popup-close">&times;</button>
          </div>
          <div class="meal-popup-content">
            <div class="form-group">
              <label for="suggestion-meal-type">Meal Type:</label>
              <select id="suggestion-meal-type" required>
                <option value="">Select meal type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div class="form-group">
              <label for="suggestion-servings">Servings:</label>
              <input type="number" id="suggestion-servings" min="1" step="1" value="1" required>
            </div>
            <div class="form-group">
              <label for="suggestion-log-date">Date:</label>
              <input type="date" id="suggestion-log-date" value="${this._getTodayString()}" required>
            </div>
            <div class="form-actions">
              <button class="btn-cancel" id="suggestion-btn-cancel">Cancel</button>
              <button class="btn-add" id="suggestion-btn-add">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const overlay = document.getElementById('suggestion-meal-popup-overlay');
    const closeBtn = document.getElementById('suggestion-popup-close');
    const cancelBtn = document.getElementById('suggestion-btn-cancel');
    const addBtn = document.getElementById('suggestion-btn-add');
    
    function closePopup() {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closePopup);
    }
    
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closePopup();
      });
    }
    
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        const mealType = document.getElementById('suggestion-meal-type')?.value;
        const servings = parseFloat(document.getElementById('suggestion-servings')?.value);
        const logDate = document.getElementById('suggestion-log-date')?.value;
        
        if (!mealType || !servings || !logDate) {
          alert('Please fill all fields');
          return;
        }
        
        try {
          addBtn.disabled = true;
          addBtn.textContent = 'Adding...';
          
          if (foodData.id && !foodData.id.startsWith('default_')) {
            const mealEntryData = {
              recipe_id: foodData.id,
              meal_type: mealType,
              servings: servings,
              log_date: logDate
            };
            
            await mealApiService.addMealFromSuggestion(mealEntryData);
            
            alert('Meal added successfully!');
            closePopup();
            
            await this._refreshDailyData();
            
          } else {
            console.log(`Demo: Added ${foodData.name} - ${mealType} - ${servings} servings on ${logDate} for user ${this._getCurrentUserId()}`);
            alert('This is a default meal. Please select suggestions from "Find Meals" for full functionality.');
            closePopup();
          }
        } catch (error) {
          console.error('Error adding meal from suggestion for user', this._getCurrentUserId(), ':', error);
          alert('Failed to add meal. Please try again.');
          addBtn.disabled = false;
          addBtn.textContent = 'Add';
        }
      });
    }
  }

  async _handleSuggestedMealDetailsClicked(mealData) {
    console.log('Suggested meal details clicked by user', this._getCurrentUserId(), ':', mealData);
    
    if (!mealData.id || mealData.id.startsWith('default_')) {
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
      console.log('🔍 Fetching meal details from API for user:', this._getCurrentUserId());
      
      this._showMealDetailsPopup({
        name: mealData.name,
        loading: true
      });

      const mealDetails = await mealApiService.getMealDetails(mealData.id);
      console.log('✅ Meal details received for user', this._getCurrentUserId(), ':', mealDetails);

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
      console.error('💥 Error fetching meal details for user', this._getCurrentUserId(), ':', error);
      
      this._showMealDetailsPopup({
        name: mealData.name,
        error: 'Failed to load meal details. Please try again.',
        calories: mealData.calories,
        image: mealData.image
      });
    }
  }

  _showMealDetailsPopup(mealDetails) {
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
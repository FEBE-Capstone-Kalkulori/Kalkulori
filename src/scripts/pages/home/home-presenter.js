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
      ]
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
      onCompleteProfileClicked: this._handleCompleteProfile.bind(this)
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

  _handleFindMeals() {
    console.log('Finding meals with keywords:', this.data.selectedKeywords);
    
    if (this.data.selectedKeywords.length === 0) {
      alert('Please select some preferences first!');
      return;
    }

    const groupedKeywords = groupKeywordsByCategory(this.data.selectedKeywords);
    console.log('Grouped keywords by category:', groupedKeywords);

    const keywordsQuery = this.data.selectedKeywords.join(',');
    console.log('Searching for meals with keywords:', keywordsQuery);
    
    this._updateSuggestedMeals();
  }

  _updateSuggestedMeals() {
    const mockMealsByCategory = {
      'dietary': [
        {
          name: 'Healthy Chicken Salad',
          image: './public/image/meals/chicken-salad.jpg',
          calories: 250,
          keywords: ['healthy', 'low calorie', 'high protein', 'chicken']
        },
        {
          name: 'Vegetarian Buddha Bowl',
          image: './public/image/meals/buddha-bowl.jpg',
          calories: 320,
          keywords: ['vegetarian', 'healthy', 'high fiber', 'vegetable']
        }
      ],
      'cooking': [
        {
          name: 'No-Cook Tuna Wraps',
          image: './public/image/meals/tuna-wraps.jpg',
          calories: 280,
          keywords: ['no cook', '< 15 mins', 'fish']
        },
        {
          name: 'Microwave Steamed Fish',
          image: './public/image/meals/steamed-fish.jpg',
          calories: 200,
          keywords: ['microwave', 'steam', 'healthy', 'fish']
        }
      ],
      'cuisine': [
        {
          name: 'Thai Green Curry',
          image: './public/image/meals/thai-curry.jpg',
          calories: 380,
          keywords: ['thai', 'spicy', 'coconut', 'chicken']
        },
        {
          name: 'Italian Pasta Primavera',
          image: './public/image/meals/pasta-primavera.jpg',
          calories: 350,
          keywords: ['italian', 'pasta', 'vegetable']
        }
      ],
      'mealtime': [
        {
          name: 'Quick Breakfast Smoothie',
          image: './public/image/meals/smoothie.jpg',
          calories: 180,
          keywords: ['breakfast', '< 15 mins', 'beverages', 'fruits']
        },
        {
          name: 'Hearty Dinner Stew',
          image: './public/image/meals/beef-stew.jpg',
          calories: 420,
          keywords: ['dinner', 'stew', 'beef', 'one dish meal']
        }
      ]
    };

    const relevantCategories = new Set();
    this.data.selectedKeywords.forEach(keyword => {
      const category = findCategoryByKeyword(keyword);
      if (category) {
        relevantCategories.add(category.key);
      }
    });

    let filteredMeals = [];

    relevantCategories.forEach(categoryKey => {
      if (mockMealsByCategory[categoryKey]) {
        filteredMeals.push(...mockMealsByCategory[categoryKey]);
      }
    });

    if (filteredMeals.length > 0) {
      filteredMeals = filteredMeals.filter(meal => {
        return this.data.selectedKeywords.some(keyword => 
          meal.keywords.includes(keyword)
        );
      });
    }

    if (filteredMeals.length === 0) {
      filteredMeals = [
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
    }

    this.data.suggestedMeals = filteredMeals.slice(0, 4);
    this._renderView();
    
    const categoryNames = Array.from(relevantCategories).join(', ');
    alert(`Found ${this.data.suggestedMeals.length} meals matching your preferences from categories: ${categoryNames || 'general'}!`);
  }

  _handleClearAll() {
    console.log('Clearing all selected keywords');
    this.data.selectedKeywords = [];
    
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
}

export default HomePresenter;
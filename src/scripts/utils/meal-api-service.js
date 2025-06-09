class MealApiService {
  constructor() {
    this.baseUrl = 'https://kalkulori.up.railway.app/api';
  }

  async createMealEntry(mealData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mealData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create meal entry');
      }
    } catch (error) {
      console.error('Error creating meal entry:', error);
      throw error;
    }
  }

  async getMealEntries(params = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams();
      
      if (params.log_date) queryParams.append('log_date', params.log_date);
      if (params.meal_type) queryParams.append('meal_type', params.meal_type);

      const url = `${this.baseUrl}/meals${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result.data.meal_entries;
      } else {
        throw new Error(result.message || 'Failed to fetch meal entries');
      }
    } catch (error) {
      console.error('Error fetching meal entries:', error);
      throw error;
    }
  }

  async getDailyLog(logDate) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/logs/${logDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            daily_log: {
              total_calories_consumed: 0,
              total_protein_consumed: 0,
              total_carbs_consumed: 0,
              total_fat_consumed: 0,
              remaining_calories: 1500
            },
            meal_entries: []
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch daily log');
      }
    } catch (error) {
      console.error('Error fetching daily log:', error);
      throw error;
    }
  }

  async updateMealEntry(mealEntryId, updateData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/meals/${mealEntryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result;
      } else {
        throw new Error(result.message || 'Failed to update meal entry');
      }
    } catch (error) {
      console.error('Error updating meal entry:', error);
      throw error;
    }
  }

  async deleteMealEntry(mealEntryId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/meals/${mealEntryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete meal entry');
      }
    } catch (error) {
      console.error('Error deleting meal entry:', error);
      throw error;
    }
  }

  async generateMealPlan() {
    try {
      const token = localStorage.getItem('authToken');
      console.log('🚀 Calling meal plan API...');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      const response = await fetch(`${this.baseUrl}/meal-plans/generate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Always parse response first
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('🚨 Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      console.log('🔍 Meal Plan API Response:', { 
        status: response.status, 
        ok: response.ok,
        data: result 
      });

      if (!response.ok) {
        let errorMessage = result.message || 'Failed to generate meal plan';
        
        // More comprehensive error handling
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (response.status === 404) {
          errorMessage = 'Profile not found. Please complete your profile first.';
        } else if (response.status === 400) {
          if (result.message && result.message.includes('calorie target')) {
            errorMessage = 'Daily calorie target not set. Please update your profile.';
          } else {
            errorMessage = result.message || 'Bad request. Please check your profile settings.';
          }
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please check your profile settings or try again later.';
        } else if (response.status === 503) {
          errorMessage = 'Meal plan service temporarily unavailable. Please try again later.';
        } else if (response.status === 504) {
          errorMessage = 'Request timeout. The service is taking too long to respond.';
        }
        
        console.error('🚨 Meal Plan API Error:', { 
          status: response.status, 
          message: errorMessage, 
          details: result,
          url: `${this.baseUrl}/meal-plans/generate`
        });
        throw new Error(errorMessage);
      }
      
      // Validate response structure
      if (result.status === 'success') {
        console.log('✅ Meal Plan API Success - validating data structure...');
        
        // Detailed response validation
        if (!result.data) {
          console.error('❌ Missing data in successful response:', result);
          throw new Error('Invalid response: missing data');
        }
        
        if (!result.data.meal_plans) {
          console.error('❌ Missing meal_plans in response data:', result.data);
          throw new Error('Invalid response: missing meal_plans');
        }
        
        if (!Array.isArray(result.data.meal_plans)) {
          console.error('❌ meal_plans is not an array:', typeof result.data.meal_plans, result.data.meal_plans);
          throw new Error('Invalid response: meal_plans should be an array');
        }
        
        if (result.data.meal_plans.length === 0) {
          console.error('❌ Empty meal_plans array:', result.data.meal_plans);
          throw new Error('No meal plans generated. Please try again.');
        }
        
        // Validate first meal plan structure
        const firstPlan = result.data.meal_plans[0];
        if (!firstPlan || typeof firstPlan !== 'object') {
          console.error('❌ Invalid first meal plan:', firstPlan);
          throw new Error('Invalid meal plan data structure');
        }
        
        // Check if it has at least one meal type (flexible case matching)
        const possibleMealTypes = [
          'breakfast', 'lunch', 'dinner',           // lowercase
          'Breakfast', 'Lunch', 'Dinner',           // capitalized
          'BREAKFAST', 'LUNCH', 'DINNER'            // uppercase
        ];
        
        console.log('🔍 Checking for meals in plan. Available keys:', Object.keys(firstPlan));
        
        const foundMeals = [];
        possibleMealTypes.forEach(type => {
          if (firstPlan[type]) {
            foundMeals.push(type);
            console.log(`✅ Found meal type: ${type}`, firstPlan[type]);
          }
        });
        
        // Alternative check: look for any object properties that might be meals
        const allKeys = Object.keys(firstPlan);
        const mealLikeKeys = allKeys.filter(key => {
          const keyLower = key.toLowerCase();
          return keyLower.includes('breakfast') || 
                 keyLower.includes('lunch') || 
                 keyLower.includes('dinner') ||
                 keyLower.includes('meal');
        });
        
        console.log('🔍 Meal-like keys found:', mealLikeKeys);
        console.log('🔍 All plan keys:', allKeys);
        
        // FIXED: Calculate hasMeals properly
        const hasMeals = foundMeals.length > 0 || mealLikeKeys.length > 0;
        
        if (!hasMeals) {
          console.error('❌ No valid meals in plan:');
          console.error('First plan structure:', JSON.stringify(firstPlan, null, 2));
          console.error('Expected meal types:', possibleMealTypes);
          console.error('Available keys:', allKeys);
          throw new Error('Generated meal plan contains no valid meals');
        }
        
        console.log(`✅ Found ${foundMeals.length} standard meals and ${mealLikeKeys.length} meal-like keys`);
        
        console.log('✅ Response validation passed:');
        console.log('  - Data exists:', !!result.data);
        console.log('  - meal_plans exists:', !!result.data.meal_plans);
        console.log('  - meal_plans is array:', Array.isArray(result.data.meal_plans));
        console.log('  - meal_plans length:', result.data.meal_plans.length);
        console.log('  - First plan structure:', Object.keys(firstPlan));
        console.log('  - Has meals:', hasMeals);
        
        // Return the full data object
        return result.data;
      } else {
        console.error('❌ API returned non-success status:', result.status, result.message);
        throw new Error(result.message || 'Failed to generate meal plan');
      }
    } catch (error) {
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 Network error detected:', error);
        throw new Error('Network error. Please check your internet connection.');
      }
      
      if (error.message.includes('Authentication')) {
        console.error('🔐 Authentication error:', error);
        // Could redirect to login here
        throw error;
      }
      
      console.error('💥 Generate Meal Plan Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Helper method to convert meal plan data to meal entry format
  async convertMealToEntry(mealData, mealType, logDate) {
    try {
      // First, get detailed meal information if we have a recipe_id
      let detailedMeal = mealData;
      
      if (mealData.recipe_id || mealData.id) {
        try {
          const recipeId = mealData.recipe_id || mealData.id;
          detailedMeal = await this.getMealDetails(recipeId);
        } catch (error) {
          console.warn('Could not fetch detailed meal info, using basic data:', error);
          // Continue with basic meal data
        }
      }
      
      const entryData = {
        food_item_id: detailedMeal.id || detailedMeal.recipe_id || `meal_plan_${Date.now()}`,
        meal_type: mealType.toLowerCase(),
        servings: detailedMeal.serving_size || 1,
        log_date: logDate
      };
      
      return await this.createMealEntry(entryData);
    } catch (error) {
      console.error('Error converting meal to entry:', error);
      throw error;
    }
  }

  // NEW: Get meal suggestions based on keywords
  async getMealSuggestions(keywords) {
    try {
      const token = localStorage.getItem('authToken');
      
      // Validate keywords
      if (!keywords || keywords.length === 0) {
        throw new Error('At least 1 keyword is required');
      }
      
      if (keywords.length > 6) {
        throw new Error('Maximum 6 keywords allowed');
      }
      
      // Join keywords with comma
      const keywordsParam = keywords.join(',');
      
      const response = await fetch(`${this.baseUrl}/meals/suggestion?keywords=${encodeURIComponent(keywordsParam)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('🔍 Meal Suggestions API Response:', { status: response.status, data: result });

      if (!response.ok) {
        let errorMessage = result.message || 'Failed to get meal suggestions';
        
        if (response.status === 404) {
          errorMessage = 'Profile not found. Please complete your profile first.';
        } else if (response.status === 400) {
          errorMessage = result.message || 'Invalid request parameters';
        } else if (response.status === 503) {
          errorMessage = 'Meal suggestion service temporarily unavailable';
        } else if (response.status === 504) {
          errorMessage = 'Request timeout. Please try again.';
        }
        
        console.error('🚨 Meal Suggestions API Error:', { status: response.status, message: errorMessage });
        throw new Error(errorMessage);
      }
      
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get meal suggestions');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      console.error('💥 Get Meal Suggestions Error:', error);
      throw error;
    }
  }

  // NEW: Get meal details by recipe ID
  async getMealDetails(recipeId) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!recipeId) {
        throw new Error('Recipe ID is required');
      }
      
      const response = await fetch(`${this.baseUrl}/meals/${recipeId}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('🔍 Meal Details API Response:', { status: response.status, data: result });

      if (!response.ok) {
        let errorMessage = result.message || 'Failed to get meal details';
        
        if (response.status === 404) {
          errorMessage = 'Recipe not found';
        } else if (response.status === 503) {
          errorMessage = 'Meal service temporarily unavailable';
        } else if (response.status === 504) {
          errorMessage = 'Request timeout. Please try again.';
        }
        
        console.error('🚨 Meal Details API Error:', { status: response.status, message: errorMessage });
        throw new Error(errorMessage);
      }
      
      if (result.status === 'success') {
        return result.data.meal;
      } else {
        throw new Error(result.message || 'Failed to get meal details');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      console.error('💥 Get Meal Details Error:', error);
      throw error;
    }
  }
}

const mealApiService = new MealApiService();

if (typeof window !== 'undefined') {
  window.mealApiService = mealApiService;
}

export default mealApiService;
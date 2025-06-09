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
      const response = await fetch(`${this.baseUrl}/meal-plans/generate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('🔍 Meal Plan API Response:', { status: response.status, data: result });

      if (!response.ok) {
        let errorMessage = result.message || 'Failed to generate meal plan';
        
        if (response.status === 404) {
          errorMessage = 'Profile not found. Please complete your profile first.';
        } else if (response.status === 400) {
          errorMessage = 'Daily calorie target not set. Please update your profile.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please check your profile settings or try again later.';
        } else if (response.status === 503) {
          errorMessage = 'Meal plan service temporarily unavailable. Please try again later.';
        } else if (response.status === 504) {
          errorMessage = 'Request timeout. The service is taking too long to respond.';
        }
        
        console.error('🚨 Meal Plan API Error:', { status: response.status, message: errorMessage, details: result });
        throw new Error(errorMessage);
      }
      
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to generate meal plan');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      console.error('💥 Generate Meal Plan Error:', error);
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
        return result.data;
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
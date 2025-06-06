import CONFIG from '../../scripts/config';

class MealApiService {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
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
}

const mealApiService = new MealApiService();

export default mealApiService;
class FoodApiService {
  constructor() {
    this.baseUrl = 'https://kalkulori.up.railway.app/api';
  }

  async getAllFoods(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.name) queryParams.append('name', params.name);
      if (params.verified !== undefined) queryParams.append('verified', params.verified);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.cursor) queryParams.append('cursor', params.cursor);
      if (params.direction) queryParams.append('direction', params.direction);

      const url = `${this.baseUrl}/foods${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          foods: result.data.foods,
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to fetch foods');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw error;
    }
  }

  async getFoodById(foodId) {
    try {
      const response = await fetch(`${this.baseUrl}/foods/${foodId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return result.data.food;
      } else {
        throw new Error(result.message || 'Failed to fetch food');
      }
    } catch (error) {
      console.error('Error fetching food by ID:', error);
      throw error;
    }
  }

  // New dedicated search method using the ML search endpoint
  async searchFoods(searchQuery, limit = 12) {
    try {
      if (!searchQuery || searchQuery.trim() === '') {
        throw new Error('Search query is required');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('name', searchQuery.trim());

      const url = `${this.baseUrl}/search?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Search service is currently unavailable');
        } else if (response.status === 504) {
          throw new Error('Search request timed out');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        // Return foods from the search result data
        return {
          foods: result.data.foods || [],
          search_query: result.data.search_query,
          total_results: result.data.total_results,
          searched_at: result.data.searched_at,
          // No pagination for search results as they come from ML service
          pagination: {
            has_next_page: false,
            has_prev_page: false,
            next_cursor: null,
            prev_cursor: null,
            current_cursor: null
          }
        };
      } else {
        throw new Error(result.message || 'Failed to search foods');
      }
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // Legacy method - now uses the new searchFoods for actual searching
  async searchFoodsLegacy(searchQuery, limit) {
    try {
      return await this.getAllFoods({
        name: searchQuery,
        limit: limit
      });
    } catch (error) {
      console.error('Error searching foods (legacy):', error);
      throw error;
    }
  }

  formatFoodForCard(apiFood) {
    return {
      id: apiFood.id || apiFood.recipe_id,
      name: apiFood.food_name,
      calories: apiFood.calories_per_serving,
      image: apiFood.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      serving_size: apiFood.serving_size,
      serving_unit: apiFood.serving_unit
    };
  }

  formatFoodsForCards(apiFoods) {
    return apiFoods.map(food => this.formatFoodForCard(food));
  }
}

const foodApiService = new FoodApiService();

export default foodApiService;
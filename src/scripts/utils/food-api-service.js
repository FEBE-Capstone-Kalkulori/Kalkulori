class FoodApiService {
  constructor() {
    // Ganti dengan URL API server Anda
    this.baseUrl = 'https://kalkulori.up.railway.app/api'; // Sesuaikan dengan URL API Anda
  }

  async getAllFoods(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.name) queryParams.append('name', params.name);
      if (params.verified !== undefined) queryParams.append('verified', params.verified);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

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
        return result.data.foods;
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

  async searchFoods(searchQuery, limit = 50) {
    try {
      return await this.getAllFoods({
        name: searchQuery,
        limit: limit
      });
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // Method untuk mengubah format data API menjadi format yang sesuai dengan FoodCard
  formatFoodForCard(apiFood) {
    return {
      id: apiFood.id,
      name: apiFood.food_name,
      calories: apiFood.calories_per_serving,
      image: apiFood.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // default image
      serving_size: apiFood.serving_size,
      serving_unit: apiFood.serving_unit
    };
  }

  // Method untuk mengubah array foods dari API
  formatFoodsForCards(apiFoods) {
    return apiFoods.map(food => this.formatFoodForCard(food));
  }
}

// Singleton instance
const foodApiService = new FoodApiService();

export default foodApiService;
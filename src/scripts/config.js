const CONFIG = {
  API_BASE_URL: 'https://kalkulori.up.railway.app/api',
    
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY_TOKEN: '/auth/verify-token',
      LOGOUT: '/auth/logout'
    },
    USER: {
      PROFILE: '/users/profile'
    },
    FOODS: '/foods',
    MEALS: {
      BASE: '/meals',
      SUGGESTION: '/meals/suggestion',        // untuk meal suggestions
      DETAILS: '/meals/{recipeId}/details'    // untuk meal details
    },
    LOGS: '/logs',
    MEAL_PLANS: {
      GENERATE: '/meal-plans/generate'
    }
  },
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_RETRY_ATTEMPTS: 3,
    
    // Meal Suggestions Settings
    MEAL_SUGGESTIONS: {
      MAX_KEYWORDS: 6,
      MIN_KEYWORDS: 1,
      DEFAULT_TOP_N: 10
    },
    
    // Default Images
    DEFAULT_IMAGES: {
      FOOD: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      USER_AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
};

export default CONFIG;
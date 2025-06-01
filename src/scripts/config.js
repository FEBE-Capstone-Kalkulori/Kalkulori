const CONFIG = {
  // FIXED: Hardcode ke production URL untuk konsistensi
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
    MEALS: '/meals',
    LOGS: '/logs'
  }
};

export default CONFIG;
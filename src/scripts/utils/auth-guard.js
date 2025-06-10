class AuthGuard {
  static API_BASE_URL = 'https://kalkulori.up.railway.app/api';
  
  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  
  static getToken() {
    return localStorage.getItem('authToken');
  }
  
  static async login(email, password) {
    try {
      console.log('🔐 AuthGuard login attempt with URL:', this.API_BASE_URL);
      console.log('🔐 Login for email:', email);
      
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('📡 Login response status:', response.status);
      console.log('📡 Login response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Login error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: `Server error: ${response.status}` };
        }
        
        return { 
          success: false, 
          message: errorData.message || 'Login failed' 
        };
      }
      
      const data = await response.json();
      console.log('📦 Login response data:', data);
      
      if (data.status === 'success') {
        console.log('✅ Login successful, saving token...');
        
        this.clearAuthData();
        
        localStorage.setItem('authToken', data.data.accessToken);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('userEmail', data.data.email);
        
        if (data.data.profile?.daily_calorie_target) {
          localStorage.setItem('dailyCalorieTarget', data.data.profile.daily_calorie_target);
        }
        
        const today = this._getTodayString();
        localStorage.setItem(`lastAppDate_${data.data.userId}`, today);
        
        console.log('💾 Token saved:', !!localStorage.getItem('authToken'));
        console.log('💾 User data saved - userId:', localStorage.getItem('userId'));
        console.log('💾 User data saved - email:', localStorage.getItem('userEmail'));
        
        return { success: true, data: data.data };
      } else {
        console.log('❌ Login failed - invalid status');
        return { success: false, message: data.message || 'Login gagal' };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check your internet connection.' 
        };
      }
      
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat login' 
      };
    }
  }
  
  static async register(userData) {
    try {
      console.log('📝 Registration attempt with URL:', this.API_BASE_URL);
      console.log('📝 Sending registration data:', userData);
      
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('📡 Registration response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Registration error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: `Server error: ${response.status}` };
        }
        
        return { 
          success: false, 
          message: errorData.message || `Registration failed. Status: ${response.status}` 
        };
      }
      
      const data = await response.json();
      console.log('📦 Registration response data:', data);
      
      if (data.status === 'success') {
        console.log('✅ Registration successful');
        return { success: true, data: data.data };
      } else {
        console.log('❌ Registration failed - invalid status');
        return { 
          success: false, 
          message: data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check your internet connection.' 
        };
      }
      
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat registrasi' 
      };
    }
  }
  
  static async verifyToken() {
    const token = this.getToken();
    if (!token) {
      console.log('🔍 No token to verify');
      return false;
    }
    
    try {
      console.log('🔍 Verifying token with URL:', this.API_BASE_URL);
      console.log('🔍 Token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${this.API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('📡 Token verification status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Token verification failed:', errorText);
        
        this.clearAuthData();
        return false;
      }
      
      const data = await response.json();
      console.log('📦 Token verification response:', data);
      
      const isValid = data.status === 'success';
      console.log('✅ Token is valid:', isValid);
      
      if (!isValid) {
        this.clearAuthData();
      }
      
      return isValid;
    } catch (error) {
      console.error('💥 Token verification error:', error);
      this.clearAuthData();
      return false;
    }
  }
  
  static async logout() {
    const token = this.getToken();
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    try {
      console.log('🚪 Logging out user:', userId);
      
      if (token) {
        console.log('📡 Calling logout API');
        await fetch(`${this.API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('💥 Logout API error:', error);
    } finally {
      this.clearAuthData(userId, userEmail);
      
      console.log('🚪 User logged out, redirecting to signin');
      window.location.hash = '#/signin';
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
  
  static clearAuthData(userId = null, userEmail = null) {
    console.log('🧹 Clearing all auth data');
    
    const currentUserId = userId || localStorage.getItem('userId');
    const currentUserEmail = userEmail || localStorage.getItem('userEmail');
    
    const baseKeysToRemove = [
      'authToken',
      'userId',
      'userEmail',
      'isAuthenticated',
      'userData',
      'dailyCalorieTarget'
    ];
    
    baseKeysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    if (currentUserId) {
      const userSpecificKeys = [
        `userData_${currentUserId}`,
        `lastAppDate_${currentUserId}`,
        `mealSuggestions_${currentUserId}`,
        `dailyLogs_${currentUserId}`,
        `mealPlan_${currentUserId}`
      ];
      
      userSpecificKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      console.log('🧹 Cleared user-specific data for userId:', currentUserId);
    }
    
    if (currentUserEmail) {
      localStorage.removeItem(`userAvatar_${currentUserEmail}`);
      console.log('🧹 Cleared avatar for userEmail:', currentUserEmail);
    }
    
    if (currentUserId) {
      localStorage.removeItem(`userAvatar_${currentUserId}`);
      console.log('🧹 Cleared avatar for userId:', currentUserId);
    }
    
    sessionStorage.clear();
    
    console.log('🧹 All authentication and user data cleared');
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      console.log('🔒 Authentication required, redirecting to signin');
      window.location.hash = '#/signin';
      return false;
    }
    return true;
  }

  static redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      console.log('✅ User already authenticated, redirecting to home');
      window.location.hash = '#/home';
      return true;
    }
    return false;
  }
  
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }
  
  static _getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  static debugAuth() {
    console.log('🐛 Auth Debug Info:');
    console.log('  - API URL:', this.API_BASE_URL);
    console.log('  - Token exists:', !!this.getToken());
    console.log('  - Token value:', this.getToken() ? this.getToken().substring(0, 20) + '...' : 'null');
    console.log('  - User ID:', localStorage.getItem('userId'));
    console.log('  - User Email:', localStorage.getItem('userEmail'));
    console.log('  - Is Authenticated:', this.isAuthenticated());
  }
}

export default AuthGuard;
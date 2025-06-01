// profile-api-service.js - FIXED VERSION WITH COMPREHENSIVE DEBUGGING
class ProfileApiService {
  constructor() {
    this.baseUrl = 'https://kalkulori.up.railway.app/api';
  }

  // Ambil token dari localStorage
  getAuthToken() {
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    const finalToken = authToken || token;
    
    console.log('🎫 Token check:');
    console.log('  - authToken exists:', !!authToken);
    console.log('  - token exists:', !!token);
    console.log('  - final token:', finalToken ? finalToken.substring(0, 20) + '...' : 'null');
    
    return finalToken;
  }

  // Get user profile dari backend
  async getUserProfile() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📡 Fetching profile from:', `${this.baseUrl}/users/profile`);
      console.log('🎫 Using token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Profile fetch response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication failed - please login again');
        } else if (response.status === 404) {
          throw new Error('Profile not found');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('📦 RAW backend response:', JSON.stringify(result, null, 2));
      
      // Validate response structure
      if (!result) {
        throw new Error('Empty response from server');
      }
      
      return result;
    } catch (error) {
      console.error('💥 Error fetching user profile:', error);
      
      // Jika error network/connection
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Update user profile ke backend
  async updateUserProfile(profileData) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Konversi dari format frontend ke backend
      const backendData = this.convertToBackendFormat(profileData);
      
      console.log('💾 Updating profile with data:', JSON.stringify(backendData, null, 2));

      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      console.log('📡 Profile update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Update error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication failed - please login again');
        } else if (response.status === 400) {
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText };
          }
          throw new Error(`Validation error: ${errorData.message || 'Invalid data'}`);
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Profile updated successfully:', result);
      return result;
    } catch (error) {
      console.error('💥 Error updating user profile:', error);
      
      // Jika error network/connection
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Konversi format data dari backend ke frontend - ENHANCED VERSION
  convertToFrontendFormat(backendData) {
    console.log('🔄 Converting backend data to frontend format...');
    console.log('🔄 Input data:', JSON.stringify(backendData, null, 2));
    
    if (!backendData) {
      throw new Error('No profile data received from server');
    }

    // Handle different possible response structures
    let actualData = backendData;
    
    // If response has status/data structure like { status: 'success', data: {...} }
    if (backendData.status === 'success' && backendData.data) {
      actualData = backendData.data;
      console.log('🔄 Found data in success response structure');
    }
    
    // If response has nested data like { data: { profile: {...} } }
    if (actualData.data) {
      actualData = actualData.data;
      console.log('🔄 Found nested data structure');
    }
    
    // Now handle user and profile objects
    const user = actualData.user || actualData;
    const profile = actualData.profile || actualData;
    
    console.log('🔄 User object:', JSON.stringify(user, null, 2));
    console.log('🔄 Profile object:', JSON.stringify(profile, null, 2));
    
    const frontendData = {
      name: profile.name || user.name || user.email || '',
      gender: profile.gender || 'male',
      age: profile.age ? String(profile.age) : '',
      weight: profile.weight ? String(profile.weight) : '',
      height: profile.height ? String(profile.height) : '',
      targetWeight: profile.target_weight ? String(profile.target_weight) : '',
      activityLevel: profile.fitness_level || profile.activity_level || 'never',
      avatar: profile.avatar || null
    };
    
    console.log('✅ Converted frontend data:', JSON.stringify(frontendData, null, 2));
    
    return frontendData;
  }

  // Konversi format data dari frontend ke backend
  convertToBackendFormat(frontendData) {
    console.log('🔄 Converting frontend data to backend format...');
    console.log('🔄 Input data:', JSON.stringify(frontendData, null, 2));
    
    const backendData = {};
    
    if (frontendData.name && frontendData.name.trim()) {
      backendData.name = frontendData.name.trim();
    }
    
    if (frontendData.gender) {
      backendData.gender = frontendData.gender;
    }
    
    if (frontendData.age && !isNaN(frontendData.age)) {
      backendData.age = parseInt(frontendData.age);
    }
    
    if (frontendData.weight && !isNaN(frontendData.weight)) {
      backendData.weight = parseInt(frontendData.weight);
    }
    
    if (frontendData.height && !isNaN(frontendData.height)) {
      backendData.height = parseInt(frontendData.height);
    }
    
    if (frontendData.targetWeight && !isNaN(frontendData.targetWeight)) {
      backendData.target_weight = parseInt(frontendData.targetWeight);
    }
    
    if (frontendData.activityLevel) {
      backendData.fitness_level = frontendData.activityLevel;
    }
    
    console.log('✅ Converted backend data:', JSON.stringify(backendData, null, 2));
    
    return backendData;
  }

  // Method untuk test koneksi - ENHANCED
  async testConnection() {
    try {
      console.log('🔗 Testing connection to:', `${this.baseUrl}/health`);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔗 Health check status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend health check successful:', data);
        return true;
      } else {
        console.log('❌ Backend health check failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  // Debug method untuk test manual API calls
  async debugApiCall() {
    console.log('🐛 Starting API debug...');
    
    // Test connection
    const connected = await this.testConnection();
    console.log('🔗 Connection test:', connected);
    
    if (!connected) {
      console.log('❌ Cannot proceed - backend not reachable');
      return;
    }
    
    // Test token
    const token = this.getAuthToken();
    if (!token) {
      console.log('❌ Cannot proceed - no token');
      return;
    }
    
    // Test profile endpoint manually
    try {
      console.log('🧪 Testing profile endpoint manually...');
      
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🧪 Manual test status:', response.status);
      
      const text = await response.text();
      console.log('🧪 Manual test response:', text);
      
      if (response.ok) {
        try {
          const json = JSON.parse(text);
          console.log('🧪 Manual test JSON:', json);
          
          // Test conversion
          const converted = this.convertToFrontendFormat(json);
          console.log('🧪 Manual test converted:', converted);
          
        } catch (e) {
          console.log('🧪 Response is not valid JSON');
        }
      }
      
    } catch (error) {
      console.error('🧪 Manual test error:', error);
    }
  }
}

export default ProfileApiService;
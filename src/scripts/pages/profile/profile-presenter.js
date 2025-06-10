import ProfileView from './profile-view';
import ProfileApiService from '../../utils/profile-api-service';

class ProfilePresenter {
  constructor({ container }) {
    this.container = container;
    this.view = ProfileView;
    this.apiService = new ProfileApiService();
    this.isEditMode = false;
    this.cameraStream = null;
    this.capturedImageData = null;
    this.userData = {
      name: '',
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      targetWeight: '',
      activityLevel: 'never',
      avatar: null
    };
    
    this.handlers = {
      onEditAvatarClicked: this._handleEditAvatarClicked.bind(this),
      onCameraOptionClicked: this._handleCameraOptionClicked.bind(this),
      onGalleryOptionClicked: this._handleGalleryOptionClicked.bind(this),
      onFileSelected: this._handleFileSelected.bind(this),
      onCameraModalClose: this._handleCameraModalClose.bind(this),
      onCameraCapture: this._handleCameraCapture.bind(this),
      onCameraRetake: this._handleCameraRetake.bind(this),
      onCameraUse: this._handleCameraUse.bind(this),
      onGenderOptionClicked: this._handleGenderOptionClicked.bind(this),
      onUpdateDataClicked: this._handleUpdateDataClicked.bind(this),
      onSaveDataClicked: this._handleSaveDataClicked.bind(this),
      onSignOutClicked: this._handleSignOutClicked.bind(this),
      onNumberIncrease: this._handleNumberIncrease.bind(this),
      onNumberDecrease: this._handleNumberDecrease.bind(this)
    };
  }
  
  async init() {
    this.view.toggleHeaders(true);
    await this._loadUserProfile();
    this._renderView();
  }
  
  onLeave() {
    this._stopCameraStream();
    this.view.toggleHeaders(false);
  }
  
  _renderView() {
    this.view.render(this.container, this.userData, this.isEditMode);
    this.view.attachEventHandlers(this.handlers);
  }

  _getAvatarKey() {
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    const identifier = userEmail || userId || 'default';
    return `userAvatar_${identifier}`;
  }

  _storeAvatar(avatarData) {
    try {
      const avatarKey = this._getAvatarKey();
      if (avatarData) {
        localStorage.setItem(avatarKey, avatarData);
        console.log(`🖼️ Avatar stored with key: ${avatarKey}`);
      } else {
        localStorage.removeItem(avatarKey);
        console.log(`🖼️ Avatar removed for key: ${avatarKey}`);
      }
    } catch (error) {
      console.error('Error storing avatar:', error);
    }
  }

  _getStoredAvatar() {
    try {
      const avatarKey = this._getAvatarKey();
      const avatar = localStorage.getItem(avatarKey);
      console.log(`🖼️ Loading avatar with key: ${avatarKey}, exists: ${!!avatar}`);
      return avatar;
    } catch (error) {
      console.error('Error getting stored avatar:', error);
      return null;
    }
  }

  async _loadUserProfile() {
    try {
      this._showLoading('Loading profile...');
      
      const token = this.apiService.getAuthToken();
      console.log('🎫 Token check - exists:', !!token);
      console.log('🎫 Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        console.log('❌ No token found, redirecting to signin');
        alert('Session expired. Please login again.');
        window.location.hash = '#/signin';
        return;
      }
      
      console.log('🔗 Testing backend connection...');
      const isConnected = await this.apiService.testConnection();
      console.log('🔗 Backend connection:', isConnected);
      
      if (!isConnected) {
        console.log('❌ Backend not reachable, using local data fallback');
        const localData = this._getStoredUserData();
        if (localData) {
          this.userData = localData;
          console.log('✅ Using local profile data as fallback');
          alert('Cannot connect to server. Using offline data.');
        } else {
          alert('Cannot connect to server and no local data available.');
        }
        
        const storedAvatar = this._getStoredAvatar();
        if (storedAvatar) {
          this.userData.avatar = storedAvatar;
          console.log('🖼️ Avatar loaded from separate storage');
        }
        return;
      }
      
      console.log('📡 Attempting to fetch profile from API...');
      const profileData = await this.apiService.getUserProfile();
      console.log('📦 RAW profile data from API:', JSON.stringify(profileData, null, 2));
      
      console.log('🔄 Converting profile data to frontend format...');
      this.userData = this.apiService.convertToFrontendFormat(profileData);
      console.log('✅ CONVERTED profile data:', JSON.stringify(this.userData, null, 2));
      
      const storedAvatar = this._getStoredAvatar();
      if (storedAvatar) {
        this.userData.avatar = storedAvatar;
        console.log('🖼️ Avatar loaded from separate storage (overriding API)');
      }
      
      console.log('🎯 FINAL userData for rendering:', JSON.stringify(this.userData, null, 2));
      console.log('✅ Profile loaded from API successfully');
      
    } catch (error) {
      console.error('💥 Error loading profile from API:', error);
      
      if (error.message.includes('Authentication failed') || error.message.includes('401')) {
        console.log('🔒 Authentication failed, clearing tokens and redirecting');
        this._clearAllUserData();
        alert('Session expired. Please login again.');
        window.location.hash = '#/signin';
        return;
      }
      
      if (error.message.includes('Profile not found') || error.message.includes('404')) {
        console.log('👤 Profile not found - new user, using default data');
        this.userData = {
          name: '',
          gender: 'male',
          age: '',
          weight: '',
          height: '',
          targetWeight: '',
          activityLevel: 'never',
          avatar: null
        };
        
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          this.userData.name = storedEmail.split('@')[0];
        }
        
        const storedAvatar = this._getStoredAvatar();
        if (storedAvatar) {
          this.userData.avatar = storedAvatar;
          console.log('🖼️ Avatar loaded for new user from separate storage');
        }
        
        console.log('ℹ️ Using default profile for new user');
        alert('Welcome! Please complete your profile information.');
        return;
      }
      
      console.log('🔄 API failed, trying localStorage fallback...');
      const localData = this._getStoredUserData();
      if (localData) {
        this.userData = localData;
        console.log('✅ Using local profile data as fallback');
        alert('Error loading profile from server. Using local data.');
      } else {
        console.log('❌ No local data available, using default profile');
        this.userData = {
          name: '',
          gender: 'male',
          age: '',
          weight: '',
          height: '',
          targetWeight: '',
          activityLevel: 'never',
          avatar: null
        };
        alert('Error loading profile. Please update your information.');
      }
      
      const storedAvatar = this._getStoredAvatar();
      if (storedAvatar) {
        this.userData.avatar = storedAvatar;
        console.log('🖼️ Avatar loaded from separate storage (fallback)');
      }
      
    } finally {
      this._hideLoading();
    }
  }

  async _saveUserProfile(profileData) {
    try {
      this._showLoading('Saving profile...');
      
      console.log('💾 Saving profile data:', JSON.stringify(profileData, null, 2));
      
      const result = await this.apiService.updateUserProfile(profileData);
      console.log('✅ Profile save result:', result);
      
      this._storeUserData();
      console.log('💾 Profile also saved to localStorage as backup');
      
      this._storeAvatar(profileData.avatar);
      
      return true;
    } catch (error) {
      console.error('💥 Error saving profile to API:', error);
      
      if (error.message.includes('Authentication failed')) {
        alert('Session expired. Please login again.');
        this._handleSignOut();
        return false;
      }
      
      this._storeUserData();
      this._storeAvatar(profileData.avatar);
      console.log('💾 Fallback: Profile saved to localStorage only');
      
      const errorMsg = error.message.includes('connect') 
        ? 'Cannot connect to server. Profile saved locally only.'
        : `Server error: ${error.message}. Profile saved locally only.`;
      
      alert(errorMsg);
      
      return true;
    } finally {
      this._hideLoading();
    }
  }
  
  _getStoredUserData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    
    const userDataKey = `userData_${userId}`;
    const storedData = localStorage.getItem(userDataKey);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          name: parsedData.name || '',
          gender: parsedData.gender || 'male',
          age: parsedData.age || '',
          weight: parsedData.weight || '',
          height: parsedData.height || '',
          targetWeight: parsedData.targetWeight || '',
          activityLevel: parsedData.activityLevel || 'never',
          avatar: null
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
      }
    }
    return null;
  }
  
  _storeUserData() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const userDataKey = `userData_${userId}`;
      const dataToStore = {
        name: this.userData.name,
        gender: this.userData.gender,
        age: this.userData.age,
        weight: this.userData.weight,
        height: this.userData.height,
        targetWeight: this.userData.targetWeight,
        activityLevel: this.userData.activityLevel
      };
      
      localStorage.setItem(userDataKey, JSON.stringify(dataToStore));
      console.log('💾 User data stored to localStorage (without avatar)');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
  
  _handleEditAvatarClicked() {
    this.view.showAvatarOptions();
  }
  
  async _handleCameraOptionClicked() {
    this.view.hideAvatarOptions();
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera is not supported on this device/browser');
        return;
      }

      this.view.showCameraModal();
      
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      const video = document.getElementById('camera-video');
      if (video) {
        video.srcObject = this.cameraStream;
      }
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(`Camera access failed: ${error.message}`);
      this.view.hideCameraModal();
    }
  }
  
  _handleGalleryOptionClicked() {
    this.view.hideAvatarOptions();
    
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  async _handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.view.validateImageFile(file)) {
      return;
    }

    try {
      this._showLoading('Processing image...');

      const resizedBlob = await this.view.resizeImage(file);
      
      const base64Data = await this.view.blobToBase64(resizedBlob);
      
      this._updateAvatar(base64Data);
      
      this._hideLoading();
      
      event.target.value = '';
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      this._hideLoading();
    }
  }

  _handleCameraModalClose() {
    this._stopCameraStream();
    this.view.hideCameraModal();
    this._resetCameraModal();
  }

  _handleCameraCapture() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    
    this.capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    canvas.style.display = 'block';
    video.style.display = 'none';
    
    document.getElementById('camera-capture-btn').style.display = 'none';
    document.getElementById('camera-retake-btn').style.display = 'inline-block';
    document.getElementById('camera-use-btn').style.display = 'inline-block';
  }

  _handleCameraRetake() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (video && canvas) {
      video.style.display = 'block';
      canvas.style.display = 'none';
      
      document.getElementById('camera-capture-btn').style.display = 'inline-block';
      document.getElementById('camera-retake-btn').style.display = 'none';
      document.getElementById('camera-use-btn').style.display = 'none';
      
      this.capturedImageData = null;
    }
  }

  _handleCameraUse() {
    if (this.capturedImageData) {
      this._updateAvatar(this.capturedImageData);
      
      this._handleCameraModalClose();
    }
  }

  _updateAvatar(imageData) {
    this.userData.avatar = imageData;
    
    const avatarImg = document.getElementById('user-avatar');
    if (avatarImg) {
      avatarImg.src = imageData;
    }
    
    this._storeAvatar(imageData);
    console.log('🖼️ Avatar updated and stored for current user');
  }

  _stopCameraStream() {
    if (this.cameraStream) {
      const tracks = this.cameraStream.getTracks();
      tracks.forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  _resetCameraModal() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (video) {
      video.style.display = 'block';
    }
    
    if (canvas) {
      canvas.style.display = 'none';
    }
    
    const captureBtn = document.getElementById('camera-capture-btn');
    const retakeBtn = document.getElementById('camera-retake-btn');
    const useBtn = document.getElementById('camera-use-btn');
    
    if (captureBtn) captureBtn.style.display = 'inline-block';
    if (retakeBtn) retakeBtn.style.display = 'none';
    if (useBtn) useBtn.style.display = 'none';
    
    this.capturedImageData = null;
  }

  _showLoading(message = 'Loading...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        color: white;
        font-size: 18px;
      ">
        <div style="
          background: white;
          color: #333;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        ">
          <div style="margin-bottom: 10px;">⏳</div>
          ${message}
        </div>
      </div>
    `;
    document.body.appendChild(loadingDiv);
  }

  _hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
  
  _handleGenderOptionClicked(gender) {
    this.view.toggleGenderOption(gender);
  }
  
  _handleUpdateDataClicked() {
    this.isEditMode = true;
    this._renderView();
  }
  
  async _handleSaveDataClicked() {
    const newUserData = this.view.getUserData();
    if (newUserData) {
      this.userData = {
        ...this.userData,
        ...newUserData
      };
      
      const success = await this._saveUserProfile(this.userData);
      
      this.isEditMode = false;
      this._renderView();
      
      if (success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    }
  }
  
  _handleSignOutClicked() {
    console.log('🚪 Sign out button clicked');
    
    if (confirm('Are you sure you want to sign out?')) {
      console.log('🚪 Sign out confirmed by user');
      this._handleSignOut();
    } else {
      console.log('🚪 Sign out cancelled by user');
    }
  }

  _clearAllUserData() {
    console.log('🧹 Starting to clear all user data...');
    
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    // List semua keys yang perlu dihapus
    const keysToRemove = [
      'isAuthenticated',
      'authToken',
      'token',
      'userId',
      'userEmail',
      'userData',
      'dailyCalorieTarget',
      'lastAppDate'
    ];
    
    // Tambahkan user-specific keys
    if (userId) {
      keysToRemove.push(`userData_${userId}`);
      keysToRemove.push(`userAvatar_${userId}`);
    }
    
    if (userEmail) {
      keysToRemove.push(`userAvatar_${userEmail}`);
    }
    
    // Hapus dari localStorage
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed localStorage key: ${key}`);
      }
    });
    
    // Clear sessionStorage juga
    sessionStorage.clear();
    console.log('🗑️ sessionStorage cleared');
    
    console.log('✅ All user data cleared successfully');
  }

  _handleSignOut() {
    console.log('🚪 Executing sign out process...');
    
    try {
      // Bersihkan semua data user
      this._clearAllUserData();
      
      // Stop camera stream jika ada
      this._stopCameraStream();
      
      // Reset state
      this.isEditMode = false;
      this.capturedImageData = null;
      this.userData = {
        name: '',
        gender: 'male',
        age: '',
        weight: '',
        height: '',
        targetWeight: '',
        activityLevel: 'never',
        avatar: null
      };
      
      console.log('✅ Sign out process completed successfully');
      
      // Redirect ke signin page
      console.log('🔄 Redirecting to signin page...');
      
      // Gunakan window.location.href untuk redirect yang lebih forceful
      window.location.href = '#/signin';
      
      // Delay sedikit sebelum reload untuk memastikan hash berubah
      setTimeout(() => {
        console.log('🔄 Forcing page reload...');
        window.location.reload(true); // Force reload from server
      }, 200);
      
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      
      // Fallback: paksa redirect meskipun ada error
      alert('Sign out completed. You will be redirected to login page.');
      window.location.href = '#/signin';
      setTimeout(() => {
        window.location.reload(true);
      }, 100);
    }
  }
  
  _handleNumberIncrease(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      const currentValue = parseInt(input.value) || 0;
      const max = parseInt(input.getAttribute('max')) || Infinity;
      if (currentValue < max) {
        input.value = currentValue + 1;
      }
    }
  }
  
  _handleNumberDecrease(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      const currentValue = parseInt(input.value) || 0;
      const min = parseInt(input.getAttribute('min')) || 0;
      if (currentValue > min) {
        input.value = currentValue - 1;
      }
    }
  }
}

export default ProfilePresenter;
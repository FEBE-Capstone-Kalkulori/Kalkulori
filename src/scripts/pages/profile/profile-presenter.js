import ProfileView from './profile-view';

class ProfilePresenter {
  constructor({ container }) {
    this.container = container;
    this.view = ProfileView;
    this.isEditMode = false;
    this.cameraStream = null;
    this.capturedImageData = null;
    this.userData = this._getStoredUserData() || {
      name: 'Budi Kulo',
      gender: 'male',
      age: '21',
      weight: '80',
      height: '172',
      targetWeight: '72',
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
    // Toggle headers - show profile header, hide home header
    this.view.toggleHeaders(true);
    this._renderView();
  }
  
  // Method untuk cleanup ketika leave profile page
  onLeave() {
    // Stop camera stream jika masih aktif
    this._stopCameraStream();
    // Kembalikan ke header home, hapus header profile
    this.view.toggleHeaders(false);
  }
  
  _renderView() {
    this.view.render(this.container, this.userData, this.isEditMode);
    this.view.attachEventHandlers(this.handlers);
  }
  
  _getStoredUserData() {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  }
  
  _storeUserData() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }
  
  _handleEditAvatarClicked() {
    this.view.showAvatarOptions();
  }
  
  // Handler untuk camera option
  async _handleCameraOptionClicked() {
    this.view.hideAvatarOptions();
    
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera is not supported on this device/browser');
        return;
      }

      // Show camera modal
      this.view.showCameraModal();
      
      // Get camera stream
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
  
  // Handler untuk gallery option
  _handleGalleryOptionClicked() {
    this.view.hideAvatarOptions();
    
    // Trigger file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  // Handler untuk file selection dari gallery
  async _handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!this.view.validateImageFile(file)) {
      return;
    }

    try {
      // Show loading
      this._showLoading('Processing image...');

      // Resize image
      const resizedBlob = await this.view.resizeImage(file);
      
      // Convert to base64
      const base64Data = await this.view.blobToBase64(resizedBlob);
      
      // Update avatar
      this._updateAvatar(base64Data);
      
      // Hide loading
      this._hideLoading();
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      this._hideLoading();
    }
  }

  // Handler untuk close camera modal
  _handleCameraModalClose() {
    this._stopCameraStream();
    this.view.hideCameraModal();
    this._resetCameraModal();
  }

  // Handler untuk capture photo
  _handleCameraCapture() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);
    
    // Get image data
    this.capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show preview and hide video
    canvas.style.display = 'block';
    video.style.display = 'none';
    
    // Update button visibility
    document.getElementById('camera-capture-btn').style.display = 'none';
    document.getElementById('camera-retake-btn').style.display = 'inline-block';
    document.getElementById('camera-use-btn').style.display = 'inline-block';
  }

  // Handler untuk retake photo
  _handleCameraRetake() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (video && canvas) {
      // Show video and hide canvas
      video.style.display = 'block';
      canvas.style.display = 'none';
      
      // Update button visibility
      document.getElementById('camera-capture-btn').style.display = 'inline-block';
      document.getElementById('camera-retake-btn').style.display = 'none';
      document.getElementById('camera-use-btn').style.display = 'none';
      
      // Clear captured data
      this.capturedImageData = null;
    }
  }

  // Handler untuk use captured photo
  _handleCameraUse() {
    if (this.capturedImageData) {
      // Update avatar with captured image
      this._updateAvatar(this.capturedImageData);
      
      // Close modal
      this._handleCameraModalClose();
    }
  }

  // Method untuk update avatar
  _updateAvatar(imageData) {
    // Update userData
    this.userData.avatar = imageData;
    
    // Update UI
    const avatarImg = document.getElementById('user-avatar');
    if (avatarImg) {
      avatarImg.src = imageData;
    }
    
    // Save to localStorage (optional, bisa disimpan saat save data)
    this._storeUserData();
  }

  // Method untuk stop camera stream
  _stopCameraStream() {
    if (this.cameraStream) {
      const tracks = this.cameraStream.getTracks();
      tracks.forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  // Method untuk reset camera modal
  _resetCameraModal() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-preview-canvas');
    
    if (video) {
      video.style.display = 'block';
    }
    
    if (canvas) {
      canvas.style.display = 'none';
    }
    
    // Reset button visibility
    const captureBtn = document.getElementById('camera-capture-btn');
    const retakeBtn = document.getElementById('camera-retake-btn');
    const useBtn = document.getElementById('camera-use-btn');
    
    if (captureBtn) captureBtn.style.display = 'inline-block';
    if (retakeBtn) retakeBtn.style.display = 'none';
    if (useBtn) useBtn.style.display = 'none';
    
    // Clear captured data
    this.capturedImageData = null;
  }

  // Method untuk show loading
  _showLoading(message = 'Loading...') {
    // Simple loading implementation
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

  // Method untuk hide loading
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
  
  _handleSaveDataClicked() {
    const newUserData = this.view.getUserData();
    if (newUserData) {
      this.userData = {
        ...this.userData,
        ...newUserData
      };
      
      this._storeUserData();
      this.isEditMode = false;
      this._renderView();
      
      // Show success message
      alert('Profile updated successfully!');
    }
  }
  
  _handleSignOutClicked() {
    if (confirm('Are you sure you want to sign out?')) {
      // Clear user data
      localStorage.removeItem('userData');
      
      // Redirect to login or home
      window.location.hash = '#/';
      
      alert('You have been signed out successfully!');
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
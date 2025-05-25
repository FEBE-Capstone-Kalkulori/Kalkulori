import ProfileView from './profile-view';

class ProfilePresenter {
  constructor({ container }) {
    this.container = container;
    this.view = ProfileView;
    this.isEditMode = false;
    this.cameraStream = null;
    this.capturedImageData = null;
    this.userData = this._getStoredUserData() || {
      name: '',
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      targetWeight: '',
      activityLevel: 'Never',
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
  
  _getStoredUserData() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        name: parsedData.name || '',
        gender: parsedData.gender || 'male',
        age: parsedData.age || '',
        weight: parsedData.weight || '',
        height: parsedData.height || '',
        targetWeight: parsedData.targetWeight || '',
        activityLevel: parsedData.activityLevel || 'sedentary',
        avatar: parsedData.avatar || null
      };
    }
    return null;
  }
  
  _storeUserData() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
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
    
    this._storeUserData();
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
      
      alert('Profile updated successfully!');
    }
  }
  
  _handleSignOutClicked() {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('isAuthenticated');
      window.location.hash = '#/signin';
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
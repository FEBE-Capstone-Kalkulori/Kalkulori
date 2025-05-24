import ProfileView from './profile-view';

class ProfilePresenter {
  constructor({ container }) {
    this.container = container;
    this.view = ProfileView;
    this.isEditMode = false;
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
      onGenderOptionClicked: this._handleGenderOptionClicked.bind(this),
      onUpdateDataClicked: this._handleUpdateDataClicked.bind(this),
      onSaveDataClicked: this._handleSaveDataClicked.bind(this),
      onSignOutClicked: this._handleSignOutClicked.bind(this),
      onNumberIncrease: this._handleNumberIncrease.bind(this),
      onNumberDecrease: this._handleNumberDecrease.bind(this)
    };
  }
  
  async init() {
    this._renderView();
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
  
  _handleCameraOptionClicked() {
    alert('Camera functionality would be implemented here');
    this.view.hideAvatarOptions();
    
    const mockAvatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    this.userData.avatar = mockAvatarUrl;
    document.getElementById('user-avatar').src = mockAvatarUrl;
  }
  
  _handleGalleryOptionClicked() {
    alert('Gallery functionality would be implemented here');
    this.view.hideAvatarOptions();
    
    const mockAvatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y';
    this.userData.avatar = mockAvatarUrl;
    document.getElementById('user-avatar').src = mockAvatarUrl;
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
    }
  }
  
  _handleSignOutClicked() {
    alert('Sign Out functionality would be implemented here');
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
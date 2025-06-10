import { createSignUpView } from './signup-view.js';
import AuthGuard from '../../utils/auth-guard.js';

const SignUpPresenter = {
  async init() {
    if (AuthGuard.redirectIfAuthenticated()) {
      return '';
    }
    
    return createSignUpView();
  },

  _initEventListeners() {
    const form1 = document.querySelector('#signup-form-1');
    const form2 = document.querySelector('#signup-form-2');
    const signInLink = document.querySelector('a[href="#signin"]');

    if (form1) form1.addEventListener('submit', this._handleStep1Submit.bind(this));
    if (form2) form2.addEventListener('submit', this._handleStep2Submit.bind(this));
    if (signInLink) signInLink.addEventListener('click', this._handleSignInLink.bind(this));
  },

  _handleStep1Submit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!this._validateStep1(email, password, confirmPassword)) {
      return;
    }

    this._storeStep1Data({ email, password });
    this._showStep2();
  },

  async _handleStep2Submit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    const step2Data = {
      name: formData.get('name'),
      gender: formData.get('gender'),
      age: formData.get('age') ? parseInt(formData.get('age')) : null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
      height: formData.get('height') ? parseFloat(formData.get('height')) : null,
      targetWeight: formData.get('targetWeight') ? parseFloat(formData.get('targetWeight')) : null,
      activityLevel: formData.get('activityLevel')
    };

    console.log('Step 2 data:', step2Data);

    if (!this._validateStep2(step2Data)) {
      return;
    }

    await this._completeSignUp(step2Data);
  },

  _handleSignInLink(event) {
    event.preventDefault();
    window.location.hash = '#/signin';
  },

  _validateStep1(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
      this._showError('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      this._showError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      this._showError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this._showError('Please enter a valid email address');
      return false;
    }

    return true;
  },

  _validateStep2(data) {
    console.log('Validating Step 2 data:', data);
    
    if (!data.name || data.name.trim() === '') {
      this._showError('Please enter your name', '#step-2');
      return false;
    }

    if (!data.gender) {
      this._showError('Please select your gender', '#step-2');
      return false;
    }

    if (!data.age || isNaN(data.age)) {
      this._showError('Please enter your age', '#step-2');
      return false;
    }

    if (!data.weight || isNaN(data.weight)) {
      this._showError('Please enter your weight', '#step-2');
      return false;
    }

    if (!data.height || isNaN(data.height)) {
      this._showError('Please enter your height', '#step-2');
      return false;
    }

    if (!data.activityLevel) {
      this._showError('Please select your activity level', '#step-2');
      return false;
    }

    if (data.age < 13 || data.age > 120) {
      this._showError('Please enter a valid age between 13 and 120', '#step-2');
      return false;
    }

    if (data.weight < 30 || data.weight > 300) {
      this._showError('Please enter a valid weight between 30 and 300 kg', '#step-2');
      return false;
    }

    if (data.height < 100 || data.height > 250) {
      this._showError('Please enter a valid height between 100 and 250 cm', '#step-2');
      return false;
    }

    if (data.targetWeight && (data.targetWeight < 30 || data.targetWeight > 300)) {
      this._showError('Please enter a valid target weight between 30 and 300 kg', '#step-2');
      return false;
    }

    return true;
  },

  _storeStep1Data(data) {
    this.step1Data = data;
  },

  _showStep2() {
    const step1 = document.querySelector('#step-1');
    const step2 = document.querySelector('#step-2');
   
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
  },

  async _completeSignUp(step2Data) {
    const button = document.querySelector('.create-account-btn');
    const originalText = button.textContent;
    
    button.textContent = 'Creating Account...';
    button.disabled = true;
    this._clearError('#step-2');

    try {
      const userData = {
        email: this.step1Data.email,
        password: this.step1Data.password,
        name: step2Data.name,
        gender: step2Data.gender,
        age: step2Data.age,
        weight: step2Data.weight,
        height: step2Data.height,
        target_weight: step2Data.targetWeight,
        fitness_level: step2Data.activityLevel
      };

      console.log('Registering user with data:', userData);

      this._clearExistingUserData();

      const result = await AuthGuard.register(userData);
      
      if (result.success) {
        this._showSuccess('Account created successfully! Redirecting to sign in...', '#step-2');
        
        console.log('✅ Registration successful for user:', result.data.userId);
        
        setTimeout(() => {
          window.location.hash = '#/signin';
        }, 2000);
      } else {
        this._showError(result.message || 'Registration failed. Please try again.', '#step-2');
        button.textContent = originalText;
        button.disabled = false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      this._showError('An error occurred during registration. Please try again.', '#step-2');
      button.textContent = originalText;
      button.disabled = false;
    }
  },

  _clearExistingUserData() {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('userData_') || 
          key.includes('lastAppDate_') ||
          key.includes('userAvatar_') ||
          key === 'authToken' ||
          key === 'userId' ||
          key === 'userEmail' ||
          key === 'isAuthenticated' ||
          key === 'userData' ||
          key === 'dailyCalorieTarget'
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      sessionStorage.clear();
      
      console.log('🧹 Cleared existing user data before registration');
    } catch (error) {
      console.error('Error clearing existing user data:', error);
    }
  },

  _showError(message, step = '#step-1') {
    this._clearError(step);
    
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #e74c3c;
      background-color: #fadbd8;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
      font-size: 14px;
      border: 1px solid #e74c3c;
    `;
    
    const stepElement = document.querySelector(step);
    const form = stepElement.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form);
  },

  _showSuccess(message, step = '#step-1') {
    this._clearError(step);
    
    const successDiv = document.createElement('div');
    successDiv.classList.add('success-message');
    successDiv.textContent = message;
    successDiv.style.cssText = `
      color: #27ae60;
      background-color: #d5f4e6;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
      font-size: 14px;
      border: 1px solid #27ae60;
    `;
    
    const stepElement = document.querySelector(step);
    const form = stepElement.querySelector('form');
    form.parentNode.insertBefore(successDiv, form);
  },

  _clearError(step = '#step-1') {
    const stepElement = document.querySelector(step);
    const existingError = stepElement.querySelector('.error-message');
    const existingSuccess = stepElement.querySelector('.success-message');
    
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
  }
};

export { SignUpPresenter };
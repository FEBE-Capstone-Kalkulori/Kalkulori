import { createSignInView } from './signin-view.js';
import AuthGuard from '../../utils/auth-guard.js';

const SignInPresenter = {
  async init() {
    if (AuthGuard.redirectIfAuthenticated()) {
      return '';
    }
    
    const view = createSignInView();
    
    this._waitForDOMAndInitialize();
    
    return view;
  },

  _waitForDOMAndInitialize() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._initEventListeners();
      });
    });
    
    setTimeout(() => {
      this._initEventListeners();
    }, 100);
  },

  _initEventListeners() {
    const form = document.querySelector('#signin-form');
    const passwordToggle = document.querySelector('#password-toggle');
    const signUpLink = document.querySelector('a[href="#signup"]');
    const forgotPasswordLink = document.querySelector('a[href="#forgot-password"]');

    if (form) form.addEventListener('submit', this._handleSignInSubmit.bind(this));
    if (passwordToggle) passwordToggle.addEventListener('click', this._togglePassword.bind(this));
    if (signUpLink) signUpLink.addEventListener('click', this._handleSignUpLink.bind(this));
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', this._handleForgotPasswordLink.bind(this));
  },

  async _handleSignInSubmit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!this._validateSignIn(email, password)) {
      return;
    }

    await this._performSignIn(email, password);
  },

  _handleSignUpLink(event) {
    event.preventDefault();
    window.location.hash = '#/signup';
  },

  _handleForgotPasswordLink(event) {
    event.preventDefault();
    alert('Forgot password functionality will be implemented soon!');
  },

  _togglePassword() {
    const passwordInput = document.querySelector('#signin-password');
    const toggleIcon = document.querySelector('#password-toggle');
   
    if (passwordInput && toggleIcon) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
          </svg>
        `;
      } else {
        passwordInput.type = 'password';
        toggleIcon.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        `;
      }
    }
  },

  _validateSignIn(email, password) {
    if (!email || !password) {
      this._showError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this._showError('Please enter a valid email address');
      return false;
    }

    return true;
  },

  async _performSignIn(email, password) {
    const button = document.querySelector('#signin-form button[type="submit"]');
    
    if (!button) {
      console.error('Sign in button not found');
      return;
    }
    
    const originalText = button.textContent;
   
    button.textContent = 'Signing In...';
    button.disabled = true;
    this._clearError();

    try {
      const result = await AuthGuard.login(email, password);
      
      if (result.success) {
        this._showSuccess('Sign in successful! Redirecting to home...');
        
        console.log('✅ Login successful for user:', result.data.userId);
        
        this._clearUserSpecificStorage();
        
        setTimeout(() => {
          window.location.hash = '#/home';
          window.location.reload();
        }, 1000);
      } else {
        this._showError(result.message || 'Login failed. Please try again.');
        button.textContent = originalText;
        button.disabled = false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      this._showError('An error occurred during sign in. Please try again.');
      button.textContent = originalText;
      button.disabled = false;
    }
  },

  _clearUserSpecificStorage() {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return;
    
    try {
      const keysToCheck = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('userData_') || 
          key.includes('lastAppDate_') ||
          key.includes('userAvatar_')
        ) && !key.includes(currentUserId)) {
          keysToCheck.push(key);
        }
      }
      
      keysToCheck.forEach(key => {
        localStorage.removeItem(key);
      });
      
      const sessionKeysToCheck = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('mealSuggestions_') ||
          key.includes('dailyLogs_') ||
          key.includes('mealPlan_')
        ) && !key.includes(currentUserId)) {
          sessionKeysToCheck.push(key);
        }
      }
      
      sessionKeysToCheck.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      console.log('🧹 Cleared data from other users during signin');
    } catch (error) {
      console.error('Error clearing other user data:', error);
    }
  },

  _showError(message) {
    this._clearError();
    
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
    
    const form = document.querySelector('#signin-form');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(errorDiv, form);
    }
  },

  _showSuccess(message) {
    this._clearError();
    
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
    
    const form = document.querySelector('#signin-form');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(successDiv, form);
    }
  },

  _clearError() {
    const existingError = document.querySelector('.error-message');
    const existingSuccess = document.querySelector('.success-message');
    
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
  }
};

export { SignInPresenter };
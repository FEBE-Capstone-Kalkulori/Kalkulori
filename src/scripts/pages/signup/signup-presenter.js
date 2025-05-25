import { createSignUpView } from './signup-view.js';
import AuthGuard from '../../utils/auth-guard.js';

const SignUpPresenter = {
  async init() {
    // Cek apakah user sudah login, jika ya redirect ke home
    if (AuthGuard.redirectIfAuthenticated()) {
      return;
    }
    
    await this._render();
    this._initEventListeners();
  },

  async _render() {
    const content = document.querySelector('#main-content');
    content.innerHTML = createSignUpView();
  },

  _initEventListeners() {
    const form1 = document.querySelector('#signup-form-1');
    const form2 = document.querySelector('#signup-form-2');
    const signInLink = document.querySelector('a[href="#signin"]');

    form1.addEventListener('submit', this._handleStep1Submit.bind(this));
    form2.addEventListener('submit', this._handleStep2Submit.bind(this));
    signInLink.addEventListener('click', this._handleSignInLink.bind(this));
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

  _handleStep2Submit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    const step2Data = {
      name: formData.get('name'),
      gender: formData.get('gender'),
      age: formData.get('age'),
      weight: formData.get('weight'),
      height: formData.get('height'),
      targetWeight: formData.get('targetWeight'),
      activityLevel: formData.get('activityLevel')
    };

    if (!this._validateStep2(step2Data)) {
      return;
    }

    this._completeSignUp(step2Data);
  },

  _handleSignInLink(event) {
    event.preventDefault();
    window.location.hash = '#/signin';
  },

  _validateStep1(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  },

  _validateStep2(data) {
    const requiredFields = ['name', 'gender', 'age', 'weight', 'height', 'activityLevel'];
   
    for (const field of requiredFields) {
      if (!data[field]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }

    if (data.age < 13 || data.age > 120) {
      alert('Please enter a valid age between 13 and 120');
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
   
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  },

  _completeSignUp(step2Data) {
    const completeData = {
      ...this.step1Data,
      ...step2Data,
      signupTime: new Date().toISOString()
    };

    console.log('Sign up completed with data:', completeData);
   
    // Simpan data user (dalam real app, ini akan dikirim ke server)
    localStorage.setItem('pendingUserData', JSON.stringify(completeData));
   
    // Mark sebagai sudah visited
    AuthGuard.markAsVisited();
    
    alert('Account created successfully! Redirecting to sign in...');
   
    // Redirect ke signin setelah signup berhasil
    setTimeout(() => {
      window.location.hash = '#/signin';
    }, 1000);
  }
};

export { SignUpPresenter };
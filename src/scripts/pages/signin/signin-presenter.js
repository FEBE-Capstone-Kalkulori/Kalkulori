import { createSignInView } from './signin-view.js';
import AuthGuard from '../../utils/auth-guard.js';

const SignInPresenter = {
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
    content.innerHTML = createSignInView();
  },

  _initEventListeners() {
    const form = document.querySelector('#signin-form');
    const passwordToggle = document.querySelector('#password-toggle');
    const signUpLink = document.querySelector('a[href="#signup"]');
    const forgotPasswordLink = document.querySelector('a[href="#forgot-password"]');

    form.addEventListener('submit', this._handleSignInSubmit.bind(this));
    passwordToggle.addEventListener('click', this._togglePassword.bind(this));
    signUpLink.addEventListener('click', this._handleSignUpLink.bind(this));
    forgotPasswordLink.addEventListener('click', this._handleForgotPasswordLink.bind(this));
  },

  _handleSignInSubmit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!this._validateSignIn(email, password)) {
      return;
    }

    this._performSignIn(email, password);
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
   
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.textContent = '🙈';
    } else {
      passwordInput.type = 'password';
      toggleIcon.textContent = '👁';
    }
  },

  _validateSignIn(email, password) {
    if (!email || !password) {
      alert('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  },

  _performSignIn(email, password) {
    console.log('Sign in attempt:', { email, password });
   
    const button = document.querySelector('.signin-btn');
    const originalText = button.textContent;
   
    button.textContent = 'Signing In...';
    button.disabled = true;

    setTimeout(() => {
      // Set user sebagai authenticated
      AuthGuard.login({ 
        email, 
        loginTime: new Date().toISOString() 
      });
     
      alert('Sign in successful! Redirecting to home...');
     
      // Redirect ke home setelah signin berhasil
      setTimeout(() => {
        window.location.hash = '#/home';
      }, 1000);
    }, 1500);
  }
};

export { SignInPresenter };
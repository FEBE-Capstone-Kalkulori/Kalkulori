class AuthGuard {
  static isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  static login() {
    localStorage.setItem('isAuthenticated', 'true');
  }
  
  static logout() {
    localStorage.removeItem('isAuthenticated');
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.hash = '#/signin';
      return false;
    }
    return true;
  }

  static redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.hash = '#/home';
      return true;
    }
    return false;
  }
}

export default AuthGuard;
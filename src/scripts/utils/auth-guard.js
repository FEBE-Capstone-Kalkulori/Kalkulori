class AuthGuard {
  static isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  static login(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('hasVisited', 'true');
  }

  static logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    // Jangan hapus hasVisited agar tidak redirect ke signup lagi
    window.location.hash = '#/signin';
  }

  static getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      // Jika belum pernah visit, redirect ke signup
      // Jika sudah pernah visit, redirect ke signin
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true');
        window.location.hash = '#/signup';
      } else {
        window.location.hash = '#/signin';
      }
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

  static isFirstVisit() {
    return !localStorage.getItem('hasVisited');
  }

  static markAsVisited() {
    localStorage.setItem('hasVisited', 'true');
  }
}

export default AuthGuard;
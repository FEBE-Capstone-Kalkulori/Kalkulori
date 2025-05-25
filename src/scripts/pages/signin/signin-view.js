const createSignInView = () => {
  return `
    <div class="signin-container">
      <div class="signin-left">
        <h1>sign in</h1>
      </div>
      <div class="signin-right">
        <div class="signin-form-container">
          <div class="signin-header">
            <h2>Sign In</h2>
          </div>
          <form id="signin-form">
            <div class="form-group">
              <label for="signin-email">Email Address</label>
              <input type="email" id="signin-email" name="email" placeholder="Enter your email..." required>
            </div>
            <div class="form-group">
              <label for="signin-password">Password</label>
              <input type="password" id="signin-password" name="password" placeholder="Enter your password..." required>
              <div class="password-toggle">
                <span class="toggle-icon" id="password-toggle">👁</span>
              </div>
            </div>
            <button type="submit" class="signin-btn">Sign In →</button>
            <div class="signin-links">
              <p>Don't have an account? <a href="#signup">Sign Up</a></p>
              <p><a href="#forgot-password">Forgot Password?</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};

export { createSignInView };
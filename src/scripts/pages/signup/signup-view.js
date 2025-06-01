const createSignUpView = () => {
  return `
    <div class="signup-container">
      <div class="signup-left">
        <h1>sign up</h1>
      </div>
      <div class="signup-right">
        <div class="signup-form-container">
          <div class="signup-step" id="step-1">
            <div class="signup-header">
              <h2>Sign Up</h2>
            </div>
            <form id="signup-form-1">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email..." required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password..." required>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password..." required>
              </div>
              <button type="submit" class="next-btn">Next Step →</button>
              <p class="signup-link">Already have an account? <a href="#signin">Sign In</a></p>
            </form>
          </div>

          <div class="signup-step hidden" id="step-2">
            <div class="signup-header">
              <h2>Sign Up 2</h2>
            </div>
            <form id="signup-form-2">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name..." required>
              </div>
              <div class="form-group gender-group">
                <label>Gender</label>
                <div class="gender-options">
                  <div class="gender-option">
                    <input type="radio" id="male" name="gender" value="male" required>
                    <label for="male" class="gender-label">
                      <span class="gender-icon">👤</span>
                      Male
                    </label>
                  </div>
                  <div class="gender-option">
                    <input type="radio" id="female" name="gender" value="female" required>
                    <label for="female" class="gender-label">
                      <span class="gender-icon">👤</span>
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" name="age" placeholder="Enter your age..." min="13" max="120" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="weight">Weight (kg)</label>
                  <input type="number" id="weight" name="weight" placeholder="Enter weight..." min="30" max="300" step="0.1" required>
                </div>
                <div class="form-group">
                  <label for="height">Height (cm)</label>
                  <input type="number" id="height" name="height" placeholder="Enter height..." min="100" max="250" step="0.1" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="targetWeight">Target Weight (kg) - Optional</label>
                  <input type="number" id="targetWeight" name="targetWeight" placeholder="Enter target weight..." min="30" max="300" step="0.1">
                </div>
                <div class="form-group">
                  <label for="activityLevel">Activity Level</label>
                  <select id="activityLevel" name="activityLevel" required>
                    <option value="">How active are you?</option>
                    <option value="daily">Daily</option>
                    <option value="regularly">Regularly</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="create-account-btn">Create Account →</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
};

export { createSignUpView };
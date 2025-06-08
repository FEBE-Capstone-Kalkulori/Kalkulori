const createSignUpView = () => {
  return `
    <div class="flex min-h-screen bg-gray-800 flex-col md:flex-row">
      <div class="flex-1 bg-gray-800 flex items-center justify-center p-8 min-h-[30vh] md:min-h-full">
        <h1 class="text-white text-2xl md:text-6xl font-light m-0 lowercase">sign up</h1>
      </div>
      <div class="flex-1 bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center p-8 min-h-[70vh] md:min-h-full">
        <div class="bg-yellow-50 p-8 md:p-12 w-full max-w-lg relative">
          <div class="signup-step transition-opacity duration-300" id="step-1">
            <div class="text-center mb-8">
              <h2 class="text-gray-600 text-3xl font-medium m-0">Sign Up</h2>
            </div>
            <form id="signup-form-1">
              <div class="mb-6">
                <label for="email" class="block text-gray-600 font-medium mb-2 text-sm">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email..." required 
                       class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              </div>
              <div class="mb-6">
                <label for="password" class="block text-gray-600 font-medium mb-2 text-sm">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password..." required 
                       class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              </div>
              <div class="mb-6">
                <label for="confirmPassword" class="block text-gray-600 font-medium mb-2 text-sm">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password..." required 
                       class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              </div>
              <button type="submit" class="w-full px-8 py-4 bg-amber-900 text-white border-none rounded-full text-base font-medium cursor-pointer transition-colors duration-300 mt-4 hover:bg-amber-800 next-btn">Next Step →</button>
              <p class="text-center mt-6 text-gray-500 text-sm">Already have an account? <a href="#signin" class="text-yellow-500 no-underline font-medium hover:underline">Sign In</a></p>
            </form>
          </div>

          <div class="signup-step transition-opacity duration-300 hidden" id="step-2">
            <div class="text-center mb-8">
              <h2 class="text-gray-600 text-3xl font-medium m-0">Sign Up 2</h2>
            </div>
            <form id="signup-form-2">
              <div class="mb-6">
                <label for="name" class="block text-gray-600 font-medium mb-2 text-sm">Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name..." required 
                       class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              </div>
              <div class="mb-6 gender-group">
                <label class="block text-gray-600 font-medium mb-2 text-sm">Gender</label>
                <div class="flex gap-4 mt-2 flex-col sm:flex-row gender-options">
                  <div class="flex-1 gender-option">
                    <input type="radio" id="male" name="gender" value="male" required class="hidden">
                    <label for="male" class="gender-label flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-300 bg-white text-center hover:border-green-500">
                      <span class="gender-icon text-2xl mb-2 text-gray-500">👤</span>
                      Male
                    </label>
                  </div>
                  <div class="flex-1 gender-option">
                    <input type="radio" id="female" name="gender" value="female" required class="hidden">
                    <label for="female" class="gender-label flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-300 bg-white text-center hover:border-green-500">
                      <span class="gender-icon text-2xl mb-2 text-gray-500">👤</span>
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div class="mb-6">
                <label for="age" class="block text-gray-600 font-medium mb-2 text-sm">Age</label>
                <input type="number" id="age" name="age" placeholder="Enter your age..." min="13" max="120" required 
                       class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              </div>
              <div class="flex gap-4 flex-col sm:flex-row">
                <div class="flex-1 mb-6">
                  <label for="weight" class="block text-gray-600 font-medium mb-2 text-sm">Weight (kg)</label>
                  <input type="number" id="weight" name="weight" placeholder="Enter weight..." min="30" max="300" step="0.1" required 
                         class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
                </div>
                <div class="flex-1 mb-6">
                  <label for="height" class="block text-gray-600 font-medium mb-2 text-sm">Height (cm)</label>
                  <input type="number" id="height" name="height" placeholder="Enter height..." min="100" max="250" step="0.1" required 
                         class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
                </div>
              </div>
              <div class="flex gap-4 flex-col sm:flex-row">
                <div class="flex-1 mb-6">
                  <label for="targetWeight" class="block text-gray-600 font-medium mb-2 text-sm">Target Weight (kg) - Optional</label>
                  <input type="number" id="targetWeight" name="targetWeight" placeholder="Enter target weight..." min="30" max="300" step="0.1" 
                         class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
                </div>
                <div class="flex-1 mb-6">
                  <label for="activityLevel" class="block text-gray-600 font-medium mb-2 text-sm">Activity Level</label>
                  <select id="activityLevel" name="activityLevel" required 
                          class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500">
                    <option value="">How active are you?</option>
                    <option value="daily">Daily</option>
                    <option value="regularly">Regularly</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="w-full px-8 py-4 bg-amber-900 text-white border-none rounded-full text-base font-medium cursor-pointer transition-colors duration-300 mt-4 hover:bg-amber-800 create-account-btn">Create Account →</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
};

export { createSignUpView };
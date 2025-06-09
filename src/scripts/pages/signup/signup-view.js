import Header from '../../components/header.js';

const createSignUpView = () => {
  return `
    <div class="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div>
        <div class="text-center mb-8">
          <h1 class="text-gray-800 text-3xl font-cal-sans mb-0">Sign Up</h1>
        </div>
        
        <div class="signup-step transition-opacity duration-300" id="step-1">
          <form id="signup-form-1" class="space-y-6">
            <div>
              <label for="email" class="block text-gray-700 font-cal-sans mb-3 text-sm">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email..." 
                required 
                class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
              >
            </div>
            
            <div>
              <label for="password" class="block text-gray-700 font-cal-sans mb-3 text-sm">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password..." 
                required 
                class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
              >
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-gray-700 font-cal-sans mb-3 text-sm">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirm your password..." 
                required 
                class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
              >
            </div>
            
            <button 
              type="submit" 
              class="next-btn w-full px-6 py-4 bg-amber-900 text-white border-none rounded-full text-sm font-cal-sans cursor-pointer transition-all duration-200 mt-8 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next Step
              <span class="text-lg">→</span>
            </button>
            
            <div class="text-center mt-8">
              <p class="text-gray-500 text-sm font-cal-sans">
                Already have an account? 
                <a href="#signin" class="text-amber-600 no-underline font-cal-sans transition-colors duration-200 hover:text-amber-700 hover:underline">Sign In</a>
              </p>
            </div>
          </form>
        </div>

        <div class="signup-step transition-opacity duration-300 hidden" id="step-2">
          <form id="signup-form-2" class="space-y-6 mb-16">
            <div>
              <label for="name" class="block text-gray-700 font-cal-sans mb-3 text-sm">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your name..." 
                required 
                class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
              >
            </div>
            
            <div class="gender-group">
              <label class="block text-gray-700 font-cal-sans mb-3 text-sm">Gender</label>
              <div class="flex gap-4">
                <div class="flex-1 gender-option">
                  <input type="radio" id="male" name="gender" value="male" required class="hidden">
                  <label for="male" class="gender-label flex items-center justify-center gap-2 bg-white border-none rounded-full px-5 py-3 text-sm text-gray-800 cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50">
                    <i class="fas fa-male"></i>
                    <span class="font-cal-sans">I am Male</span>
                  </label>
                </div>
                <div class="flex-1 gender-option">
                  <input type="radio" id="female" name="gender" value="female" required class="hidden">
                  <label for="female" class="gender-label flex items-center justify-center gap-2 bg-white border-none rounded-full px-5 py-3 text-sm text-gray-800 cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50">
                    <i class="fas fa-female"></i>
                    <span class="font-cal-sans">I am Female</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label for="age" class="block text-gray-700 font-cal-sans mb-3 text-sm">Age</label>
              <input 
                type="number" 
                id="age" 
                name="age" 
                placeholder="Enter your age..." 
                min="13" 
                max="120" 
                required 
                class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
              >
            </div>
            
            <div class="flex gap-4 flex-col sm:flex-row">
              <div class="flex-1">
                <label for="weight" class="block text-gray-700 font-cal-sans mb-3 text-sm">Weight (kg)</label>
                <input 
                  type="number" 
                  id="weight" 
                  name="weight" 
                  placeholder="Enter weight..." 
                  min="30" 
                  max="300" 
                  step="0.1" 
                  required 
                  class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
                >
              </div>
              <div class="flex-1">
                <label for="height" class="block text-gray-700 font-cal-sans mb-3 text-sm">Height (cm)</label>
                <input 
                  type="number" 
                  id="height" 
                  name="height" 
                  placeholder="Enter height..." 
                  min="100" 
                  max="250" 
                  step="0.1" 
                  required 
                  class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
                >
              </div>
            </div>
            
            <div class="flex gap-4 flex-col sm:flex-row">
              <div class="flex-1">
                <label for="targetWeight" class="block text-gray-700 font-cal-sans mb-3 text-sm">Target Weight (kg)</label>
                <input 
                  type="number" 
                  id="targetWeight" 
                  name="targetWeight" 
                  placeholder="Enter target weight..." 
                  min="30" 
                  max="300" 
                  step="0.1" 
                  required 
                  class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
                >
              </div>
              <div class="flex-1">
                <label for="activityLevel" class="block text-gray-700 font-cal-sans mb-3 text-sm">Activity Level</label>
                <select 
                  id="activityLevel" 
                  name="activityLevel" 
                  required 
                  class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white"
                >
                  <option value="">How active are you?</option>
                  <option value="daily">Daily</option>
                  <option value="regularly">Regularly</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="create-account-btn w-full px-6 py-4 bg-amber-900 text-white border-none rounded-full text-sm font-cal-sans cursor-pointer transition-all duration-200 mt-12 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Create Account
              <span class="text-lg">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
};

export { createSignUpView };

export default {
  render(container) {
    const header = new Header();
    const headerContainer = document.getElementById('header-container') || document.querySelector('header');
    
    if (headerContainer) {
      headerContainer.innerHTML = header.render('auth');
    }
    
    container.innerHTML = createSignUpView();
  }
};
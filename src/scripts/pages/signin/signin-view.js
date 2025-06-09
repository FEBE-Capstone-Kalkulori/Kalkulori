import Header from "../../components/header.js";

const createSignInView = () => {
  return `
    <div class="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div>
        <div class="text-center mb-8">
          <h1 class="text-gray-800 text-3xl font-cal-sans mb-0">Sign In</h1>
        </div>
        
        <form id="signin-form" class="space-y-6">
          <div>
            <label for="signin-email" class="block text-gray-700 font-cal-sans mb-3 text-sm">Email Address</label>
            <input 
              type="email" 
              id="signin-email" 
              name="email" 
              placeholder="Enter your email..." 
              required 
              class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
            >
          </div>
          
          <div class="relative">
            <label for="signin-password" class="block text-gray-700 font-cal-sans mb-3 text-sm">Password</label>
            <input 
              type="password" 
              id="signin-password" 
              name="password" 
              placeholder="Enter your password..." 
              required 
              class="w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl text-sm bg-gray-50 font-cal-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 focus:bg-white placeholder-gray-400"
            >
            <div class="absolute right-4 top-12 cursor-pointer">
              <button type="button" id="password-toggle" class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 border-none bg-transparent cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            id="signin-button"
            class="signin-btn w-full px-6 py-4 bg-amber-900 text-white border-none rounded-full text-sm font-cal-sans cursor-pointer transition-all duration-200 mt-8 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Sign In
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
            </svg>
          </button>
          
          <div class="text-center mt-8 space-y-2">
            <p class="text-gray-500 text-sm font-cal-sans">
              Don't have an account? 
              <a href="#signup" class="text-amber-600 no-underline font-cal-sans transition-colors duration-200 hover:text-amber-700 hover:underline">Sign Up</a>
            </p>
            <p class="text-amber-600 text-sm font-cal-sans">
              <a href="#forgot-password" class="no-underline transition-colors duration-200 hover:text-amber-700 hover:underline">Forgot Password</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `;
};

export { createSignInView };

export default {
  render(container) {
    const header = new Header();
    const headerContainer =
      document.getElementById("header-container") ||
      document.querySelector("header");

    if (headerContainer) {
      headerContainer.innerHTML = header.render("auth");
    }

    container.innerHTML = createSignInView();
  },
};

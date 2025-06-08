const createSignInView = () => {
  return `
    <div class="flex min-h-screen bg-gray-800">
      <div class="flex-1 bg-gray-800 flex items-center justify-center p-8">
        <h1 class="text-white text-4xl md:text-6xl font-light m-0 lowercase">sign in</h1>
      </div>
      <div class="flex-1 bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center p-8">
        <div class="bg-yellow-50 p-8 md:p-12 w-full max-w-md">
          <div class="text-center mb-10">
            <h2 class="text-gray-600 text-3xl font-medium m-0">Sign In</h2>
          </div>
          <form id="signin-form">
            <div class="mb-7 relative">
              <label for="signin-email" class="block text-gray-600 font-medium mb-2 text-sm">Email Address</label>
              <input type="email" id="signin-email" name="email" placeholder="Enter your email..." required 
                     class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
            </div>
            <div class="mb-7 relative">
              <label for="signin-password" class="block text-gray-600 font-medium mb-2 text-sm">Password</label>
              <input type="password" id="signin-password" name="password" placeholder="Enter your password..." required 
                     class="w-full p-4 border-2 border-gray-300 rounded-lg text-sm bg-white transition-colors duration-300 focus:outline-none focus:border-green-500 placeholder-gray-400">
              <div class="absolute right-4 top-9 cursor-pointer select-none">
                <span class="text-lg text-gray-500 transition-colors duration-300 hover:text-green-500" id="password-toggle">👁</span>
              </div>
            </div>
            <button type="submit" class="w-full px-8 py-4 bg-amber-900 text-white border-none rounded-full text-base font-medium cursor-pointer transition-colors duration-300 mt-4 hover:bg-amber-800 disabled:opacity-70 disabled:cursor-not-allowed signin-btn">Sign In →</button>
            <div class="text-center mt-8">
              <p class="my-3 text-gray-500 text-sm">Don't have an account? <a href="#signup" class="text-yellow-500 no-underline font-medium transition-colors duration-300 hover:underline hover:text-yellow-600">Sign Up</a></p>
              <p class="my-3 text-gray-500 text-sm"><a href="#forgot-password" class="text-yellow-500 no-underline font-medium transition-colors duration-300 hover:underline hover:text-yellow-600">Forgot Password?</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};

export { createSignInView };
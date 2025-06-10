import Header from "../../components/header.js";

class HistoryView {
  constructor() {
    this.header = new Header();
  }

  getTemplate() {
    return `
      <div class="max-w-7xl mx-auto px-4 py-6 md:py-10 bg-yellow-200 bg-opacity-50 min-h-[60vh]">
        <div class="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <h1 class="font-roboto-slab text-2xl md:text-3xl lg:text-4xl text-amber-900 font-semibold text-center sm:text-left">Your Daily Calories Journey</h1>
          <div class="relative">
            <select id="month-dropdown" class="px-4 py-2 md:px-5 md:py-3 bg-amber-800 text-white border-none rounded-full text-base md:text-lg font-medium cursor-pointer min-w-32 appearance-none hover:bg-amber-700 transition-colors duration-300" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;12&quot; height=&quot;12&quot; viewBox=&quot;0 0 12 12&quot;><path fill=&quot;white&quot; d=&quot;M6 9L1.5 4.5h9L6 9z&quot;/></svg>'); background-repeat: no-repeat; background-position: right 15px center;">
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
          </div>
        </div>
        
        <!-- Main Content Grid - Improved proportions and responsiveness -->
        <div class="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          <!-- Chart Section - Adjusted to 3/5 of width on xl screens -->
          <div class="xl:col-span-3 order-1">
            <div class="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl shadow-lg border-2 md:border-4 border-lime-300">
              <div class="flex items-end h-64 md:h-80 relative">
                <div class="flex flex-col justify-between h-56 md:h-72 mr-3 md:mr-5 font-medium text-gray-600 text-xs md:text-sm">
                  <span>3000</span>
                  <span>2500</span>
                  <span>2000</span>
                  <span>1500</span>
                  <span>1000</span>
                  <span>500</span>
                  <span>0</span>
                </div>
                <div class="flex-1 h-56 md:h-72 flex items-end justify-around px-1 md:px-2" id="chart-bars">
                </div>
              </div>
              <div class="chart-x-axis flex justify-around mt-3 md:mt-4 text-gray-600 font-medium ml-6 md:ml-10 text-xs md:text-sm">
              </div>
            </div>
          </div>
          
          <!-- Quick Add Section - Adjusted to 2/5 of width on xl screens -->
          <div class="xl:col-span-2 order-2">
            <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border-2 md:border-4 border-lime-300">
              <h3 class="text-lg md:text-xl font-semibold text-amber-900 mb-3 md:mb-4 font-roboto-slab">Quick Add</h3>
              <div class="space-y-2 md:space-y-3 max-h-64 md:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" id="history-food-container">
                <div class="flex items-center justify-center h-32 md:h-40 text-gray-500">
                  <div class="animate-spin rounded-full h-6 md:h-8 w-6 md:w-8 border-b-2 border-amber-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Week Selection Buttons -->
        <div class="flex gap-2 md:gap-4 justify-center flex-wrap">
          <button class="week-btn px-4 py-2 md:px-6 md:py-3 bg-lime-600 text-white border-none rounded-xl md:rounded-2xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5" data-week="1">Week 1</button>
          <button class="week-btn px-4 py-2 md:px-6 md:py-3 bg-lime-300 text-amber-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="2">Week 2</button>
          <button class="week-btn px-4 py-2 md:px-6 md:py-3 bg-lime-300 text-amber-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="3">Week 3</button>
          <button class="week-btn px-4 py-2 md:px-6 md:py-3 bg-lime-300 text-amber-900 border-none rounded-xl md:rounded-2xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="4">Week 4</button>
        </div>
      </div>
    `;
  }

  // HAPUS method createHistoryHeader() dan gunakan Header component
  
  render(container) {
    // Render header menggunakan Header component seperti profile-view
    const headerContainer = document.getElementById("header-container") || document.querySelector("header");
    
    if (headerContainer) {
      headerContainer.innerHTML = this.header.render("page", "history");
    }
    
    // Render konten history
    container.innerHTML = this.getTemplate();
  }

  toggleHeaders(showHistoryHeader = true) {
    try {
      const headerContainer = document.getElementById("header-container") || document.querySelector("header");

      if (showHistoryHeader && headerContainer) {
        // Gunakan Header component seperti profile-view
        headerContainer.innerHTML = this.header.render("page", "history");
      }

      const homeHeader = document.querySelector("header");
      if (homeHeader && !showHistoryHeader) {
        homeHeader.style.display = "block";
      }
    } catch (error) {
      console.error("Error toggling headers:", error);
      const homeHeader = document.querySelector("header");
      if (homeHeader && !showHistoryHeader) {
        homeHeader.style.display = "block";
      }
    }
  }

  forceCleanupHeaders() {
    try {
      // Cleanup semua header custom
      const allHistoryHeaders = document.querySelectorAll(".kalkulori-history-header");
      allHistoryHeaders.forEach((header) => header.remove());

      const homeHeader = document.querySelector("header");
      if (homeHeader) {
        homeHeader.style.display = "block";
      }

      if (this.header) {
        this.header.destroy();
      }
    } catch (error) {
      console.error("Error in force cleanup:", error);
    }
  }
}

export default HistoryView;
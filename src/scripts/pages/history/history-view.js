import Header from "../../components/header.js";

class HistoryView {
  constructor() {
    this.header = new Header();
  }

  getTemplate() {
    return `
      <div class="w-full min-h-screen bg-yellow-200 bg-opacity-50">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 class="font-roboto-slab text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-900 font-semibold w-full sm:w-auto text-center sm:text-left">Your Daily Calories Journey</h1>
            <div class="relative w-full sm:w-auto">
              <select id="month-dropdown" class="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 bg-amber-800 text-white border-none rounded-full text-sm sm:text-base font-medium cursor-pointer min-w-32 appearance-none hover:bg-amber-700 transition-colors duration-300" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;12&quot; height=&quot;12&quot; viewBox=&quot;0 0 12 12&quot;><path fill=&quot;white&quot; d=&quot;M6 9L1.5 4.5h9L6 9z&quot;/></svg>'); background-repeat: no-repeat; background-position: right 15px center;">
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
          
          <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div class="w-full lg:w-3/5 order-2 lg:order-1">
              <div class="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-lime-300">
                <div class="overflow-x-auto">
                  <div class="min-w-80 sm:min-w-0">
                    <div class="flex items-end h-48 sm:h-56 md:h-64 lg:h-72 relative">
                      <div class="flex flex-col justify-between h-40 sm:h-48 md:h-56 lg:h-64 mr-2 sm:mr-3 md:mr-4 font-medium text-gray-600 text-xs sm:text-sm">
                        <span>3000</span>
                        <span>2500</span>
                        <span>2000</span>
                        <span>1500</span>
                        <span>1000</span>
                        <span>500</span>
                        <span>0</span>
                      </div>
                      <div class="flex-1 h-40 sm:h-48 md:h-56 lg:h-64 flex items-end justify-around px-1" id="chart-bars">
                      </div>
                    </div>
                    <div class="chart-x-axis flex justify-around mt-2 sm:mt-3 text-gray-600 font-medium ml-4 sm:ml-6 md:ml-8 text-xs sm:text-sm">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="w-full lg:w-2/5 order-1 lg:order-2">
              <div class="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-lime-300">
                <h3 class="text-base sm:text-lg md:text-xl font-semibold text-amber-900 mb-3 sm:mb-4 font-roboto-slab">Food History</h3>
                <div class="space-y-2 sm:space-y-3 max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" id="history-food-container">
                  <div class="flex items-center justify-center h-32 sm:h-40 text-gray-500">
                    <div class="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-amber-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <button class="week-btn flex-1 min-w-0 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-lime-600 text-white border-none rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5 active:scale-95" data-week="1">Week 1</button>
            <button class="week-btn flex-1 min-w-0 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-lime-300 text-amber-900 border-none rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95" data-week="2">Week 2</button>
            <button class="week-btn flex-1 min-w-0 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-lime-300 text-amber-900 border-none rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95" data-week="3">Week 3</button>
            <button class="week-btn flex-1 min-w-0 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-lime-300 text-amber-900 border-none rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95" data-week="4">Week 4</button>
          </div>
        </div>
      </div>
    `;
  }
  
  render(container) {
    const headerContainer = document.getElementById("header-container") || document.querySelector("header");
    
    if (headerContainer) {
      headerContainer.innerHTML = this.header.render("page", "history");
    }
    
    container.innerHTML = this.getTemplate();
  }

  toggleHeaders(showHistoryHeader = true) {
    try {
      const headerContainer = document.getElementById("header-container") || document.querySelector("header");

      if (showHistoryHeader && headerContainer) {
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
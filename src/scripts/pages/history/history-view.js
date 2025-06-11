import Header from "../../components/header.js";

class HistoryView {
  constructor() {
    this.header = new Header();
  }

  getTemplate() {
    return `
      <div class="w-full pb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <!-- Header Section -->
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
            <h1 class="font-roboto-slab text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-900 font-semibold text-center lg:text-left leading-tight">
              Your Daily Calories Journey
            </h1>
            <div class="w-full lg:w-auto lg:min-w-48">
              <select id="month-dropdown" class="w-full px-4 py-3 bg-amber-800 text-white border-none rounded-full text-base font-medium cursor-pointer appearance-none hover:bg-amber-700 focus:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-300" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;12&quot; height=&quot;12&quot; viewBox=&quot;0 0 12 12&quot;><path fill=&quot;white&quot; d=&quot;M6 9L1.5 4.5h9L6 9z&quot;/></svg>'); background-repeat: no-repeat; background-position: right 15px center;">
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
          
          <!-- Main Content Section -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 lg:mb-8">
            <!-- Chart Section -->
            <div class="lg:col-span-3 order-2 lg:order-1">
              <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-lime-300 h-full">
                <div class="overflow-x-auto">
                  <div class="min-w-96">
                    <div class="flex items-end h-64 sm:h-72 lg:h-80 relative">
                      <!-- Y-axis labels -->
                      <div class="flex flex-col justify-between h-56 sm:h-64 lg:h-72 mr-4 font-medium text-gray-600 text-sm min-w-12">
                        <span>3000</span>
                        <span>2500</span>
                        <span>2000</span>
                        <span>1500</span>
                        <span>1000</span>
                        <span>500</span>
                        <span>0</span>
                      </div>
                      <!-- Chart bars container -->
                      <div class="flex-1 h-56 sm:h-64 lg:h-72 flex items-end justify-around" id="chart-bars">
                        <!-- Chart bars will be dynamically inserted here -->
                      </div>
                    </div>
                    <!-- X-axis labels -->
                    <div class="flex mt-3 text-gray-600 font-medium text-sm">
                      <div class="min-w-12 mr-4"></div>
                      <div class="chart-x-axis flex-1 flex justify-around">
                        <!-- X-axis labels will be dynamically inserted here -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Food History Section -->
            <div class="lg:col-span-2 order-1 lg:order-2">
              <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-lime-300 h-full">
                <h3 class="text-lg sm:text-xl font-semibold text-amber-900 mb-4 font-roboto-slab">Food History</h3>
                <div class="space-y-3 h-56 sm:h-64 lg:h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2" id="history-food-container">
                  <!-- Loading state -->
                  <div class="flex items-center justify-center h-full text-gray-500">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Week Navigation Buttons -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:flex lg:justify-center lg:gap-6">
            <button class="week-btn px-4 sm:px-6 py-3 bg-lime-600 text-white border-none rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2" data-week="1">
              Week 1
            </button>
            <button class="week-btn px-4 sm:px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2" data-week="2">
              Week 2
            </button>
            <button class="week-btn px-4 sm:px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2" data-week="3">
              Week 3
            </button>
            <button class="week-btn px-4 sm:px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2" data-week="4">
              Week 4
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render(container) {
    const headerContainer =
      document.getElementById("header-container") ||
      document.querySelector("header");

    if (headerContainer) {
      headerContainer.innerHTML = this.header.render("page", "history");
    }

    container.innerHTML = this.getTemplate();
  }

  toggleHeaders(showHistoryHeader = true) {
    try {
      const headerContainer =
        document.getElementById("header-container") ||
        document.querySelector("header");

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
      const allHistoryHeaders = document.querySelectorAll(
        ".kalkulori-history-header"
      );
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

class HistoryView {
  constructor() {
    this.historyHeaderId = 'kalkulori-history-header-unique';
  }

  getTemplate() {
    return `
      <div class="max-w-6xl mx-auto px-5 py-10 bg-yellow-200 bg-opacity-50 min-h-[60vh]">
        <div class="flex justify-between items-center mb-10 flex-col sm:flex-row gap-4">
          <h1 class="font-roboto-slab text-3xl md:text-4xl text-amber-900 font-semibold">Your Daily Calories Journey</h1>
          <div class="relative">
            <select id="month-dropdown" class="px-5 py-3 bg-amber-800 text-white border-none rounded-full text-lg font-medium cursor-pointer min-w-32 appearance-none hover:bg-amber-700 transition-colors duration-300" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;12&quot; height=&quot;12&quot; viewBox=&quot;0 0 12 12&quot;><path fill=&quot;white&quot; d=&quot;M6 9L1.5 4.5h9L6 9z&quot;/></svg>'); background-repeat: no-repeat; background-position: right 15px center;">
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
        
        <div class="bg-white p-8 rounded-3xl shadow-lg mb-8 border-4 border-lime-300">
          <div class="flex items-end h-80 relative">
            <div class="flex flex-col justify-between h-72 mr-5 font-medium text-gray-600 text-sm">
              <span>3000</span>
              <span>2500</span>
              <span>2000</span>
              <span>1500</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>
            <div class="flex-1 h-72 flex items-end justify-around px-2" id="chart-bars">
              <!-- Chart bars akan dirender di sini -->
            </div>
          </div>
          <div class="chart-x-axis flex justify-around mt-4 text-gray-600 font-medium ml-10">
            <!-- X-axis labels akan dirender di sini -->
          </div>
        </div>
        
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="week-btn px-6 py-3 bg-lime-600 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5" data-week="1">Week 1</button>
          <button class="week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="2">Week 2</button>
          <button class="week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="3">Week 3</button>
          <button class="week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5" data-week="4">Week 4</button>
        </div>
      </div>
    `;
  }

  // Method untuk membuat header khusus history dengan ID unik
  createHistoryHeader() {
    return `
      <div id="${this.historyHeaderId}" class="kalkulori-history-header bg-yellow-200 py-4 shadow-lg sticky top-0 z-30 mb-0">
        <div class="max-w-6xl mx-auto flex justify-between items-center px-5 flex-col md:flex-row gap-4 md:gap-0">
          <div class="text-3xl md:text-4xl font-bold text-amber-900 font-cal-sans">
            <span class="text-lime-600">kalku</span>lori
          </div>
          <nav>
            <ul class="flex gap-6 md:gap-10 list-none m-0 p-0">
              <li class="text-lg font-medium">
                <a href="#/" class="no-underline text-amber-900 transition-all duration-300 px-4 py-2 rounded-2xl font-roboto-slab hover:text-lime-600 hover:bg-lime-600 hover:bg-opacity-10">Home</a>
              </li>
              <li class="text-lg font-medium">
                <a href="#/history" class="no-underline text-lime-600 font-semibold bg-lime-600 bg-opacity-20 px-4 py-2 rounded-2xl font-roboto-slab">History</a>
              </li>
              <li class="text-lg font-medium">
                <a href="#/profile" class="no-underline text-amber-900 transition-all duration-300 px-4 py-2 rounded-2xl font-roboto-slab hover:text-lime-600 hover:bg-lime-600 hover:bg-opacity-10">Profile</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    `;
  }

  // Method untuk hide/show header dengan better error handling
  toggleHeaders(showHistoryHeader = true) {
    try {
      // CLEANUP: Hapus history header yang spesifik dengan ID
      const existingHistoryHeader = document.getElementById(this.historyHeaderId);
      if (existingHistoryHeader) {
        existingHistoryHeader.remove();
      }
      
      // Juga cleanup berdasarkan class (fallback untuk header lama)
      const existingHistoryHeaders = document.querySelectorAll('.kalkulori-history-header');
      existingHistoryHeaders.forEach(header => {
        if (header.id !== this.historyHeaderId) {
          header.remove();
        }
      });
      
      const homeHeader = document.querySelector('header');
      
      if (showHistoryHeader) {
        // Hide home header dengan smooth transition
        if (homeHeader) {
          homeHeader.style.display = 'none';
        }
        
        // Create history header hanya jika belum ada
        if (!document.getElementById(this.historyHeaderId)) {
          const historyHeaderHTML = this.createHistoryHeader();
          document.body.insertAdjacentHTML('afterbegin', historyHeaderHTML);
        }
        
      } else {
        // Show home header back
        if (homeHeader) {
          homeHeader.style.display = 'block';
        }
      }
      
    } catch (error) {
      console.error('Error toggling headers:', error);
      // Fallback: pastikan home header selalu visible jika ada error
      const homeHeader = document.querySelector('header');
      if (homeHeader && !showHistoryHeader) {
        homeHeader.style.display = 'block';
      }
    }
  }

  // Method untuk force cleanup semua history headers
  forceCleanupHeaders() {
    try {
      // Remove by ID
      const specificHeader = document.getElementById(this.historyHeaderId);
      if (specificHeader) {
        specificHeader.remove();
      }
      
      // Remove by class (catch-all)
      const allHistoryHeaders = document.querySelectorAll('.kalkulori-history-header');
      allHistoryHeaders.forEach(header => header.remove());
      
      // Ensure home header is visible
      const homeHeader = document.querySelector('header');
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
      
    } catch (error) {
      console.error('Error in force cleanup:', error);
    }
  }

  // Method untuk check apakah history header sedang aktif
  isHistoryHeaderActive() {
    return document.getElementById(this.historyHeaderId) !== null;
  }
}

export default HistoryView;
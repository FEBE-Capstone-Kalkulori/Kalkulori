import mealApiService from '../../utils/meal-api-service';

class HistoryPresenter {
  constructor(view) {
    this.view = view;
    this.currentYear = new Date().getFullYear();
    this.chartData = [];
    
    // Initialize dengan tanggal hari ini
    this.initCurrentDateSettings();
  }

  initCurrentDateSettings() {
    const today = new Date();
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    // Set bulan sekarang
    this.currentMonth = monthNames[today.getMonth()];
    
    // Hitung minggu ke berapa dalam bulan ini
    this.currentWeek = this.calculateCurrentWeekInMonth(today);
  }

  calculateCurrentWeekInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Dapatkan hari pertama bulan ini
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Hitung minggu ke berapa tanggal ini berada
    const weekNumber = Math.ceil((day + firstDayOfWeek) / 7);
    
    // Pastikan tidak lebih dari minggu 4
    return Math.min(weekNumber, 4);
  }

  init() {
    this.setInitialMonthDropdown();
    this.bindEvents();
    this.updateActiveWeekButton();
    this.loadChartData();
  }

  setInitialMonthDropdown() {
    const monthDropdown = document.getElementById('month-dropdown');
    if (monthDropdown) {
      monthDropdown.value = this.currentMonth;
    }
  }

  bindEvents() {
    const monthDropdown = document.getElementById('month-dropdown');
    const weekButtons = document.querySelectorAll('.week-btn');

    monthDropdown.addEventListener('change', (e) => {
      this.currentMonth = e.target.value;
      this.loadChartData();
    });

    weekButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentWeek = parseInt(e.target.dataset.week);
        this.updateActiveWeekButton();
        this.loadChartData();
      });
    });
  }

  updateActiveWeekButton() {
    const weekButtons = document.querySelectorAll('.week-btn');
    weekButtons.forEach(btn => {
      const week = parseInt(btn.dataset.week);
      
      if (week === this.currentWeek) {
        btn.className = 'week-btn px-6 py-3 bg-lime-600 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5';
      } else {
        btn.className = 'week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5';
      }
    });
  }

  getMonthNumber(monthName) {
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    return months[monthName];
  }

  getWeekDates() {
    const monthNum = this.getMonthNumber(this.currentMonth);
    const year = this.currentYear;
    
    // Get first day of the month
    const firstDay = new Date(year, monthNum, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start date of the selected week
    const weekStart = new Date(firstDay);
    weekStart.setDate(1 - firstDayOfWeek + (this.currentWeek - 1) * 7);
    
    // Generate 7 dates for the week
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  }

  formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadChartData() {
    try {
      this.showLoading();
      
      const weekDates = this.getWeekDates();
      const chartData = [];
      
      // Fetch data for each day in the week
      for (const date of weekDates) {
        const dateStr = this.formatDateForAPI(date);
        
        try {
          const dailyData = await mealApiService.getDailyLog(dateStr);
          const calories = dailyData.daily_log?.total_calories_consumed || 0;
          
          chartData.push({
            date: date,
            dateLabel: this.formatDate(date),
            calories: calories
          });
        } catch (error) {
          // If no data for this date, use 0 calories
          chartData.push({
            date: date,
            dateLabel: this.formatDate(date),
            calories: 0
          });
        }
      }
      
      this.chartData = chartData;
      this.renderChart();
      
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.showError('Failed to load chart data');
    } finally {
      this.hideLoading();
    }
  }

  renderChart() {
    const chartBars = document.getElementById('chart-bars');
    const chartXAxis = document.querySelector('.chart-x-axis');
    
    if (!chartBars || !chartXAxis) return;
    
    // Clear existing content
    chartBars.innerHTML = '';
    chartXAxis.innerHTML = '';
    
    // Find max calories to scale bars
    const maxCalories = Math.max(...this.chartData.map(d => d.calories), 2500);
    const chartHeight = 288; // h-72 = 288px
    
    // Render bars
    this.chartData.forEach((data, index) => {
      // Calculate bar height (percentage of max height)
      const barHeight = data.calories > 0 ? (data.calories / maxCalories) * chartHeight : 0;
      
      // Create bar element
      const bar = document.createElement('div');
      bar.className = 'bg-amber-800 w-8 sm:w-12 mx-1 rounded-t-sm transition-all duration-300 hover:bg-amber-700 cursor-pointer relative group';
      bar.style.height = `${barHeight}px`;
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10';
      tooltip.textContent = `${data.calories} cal`;
      bar.appendChild(tooltip);
      
      // Highlight bar jika itu adalah hari ini
      if (this.isToday(data.date)) {
        bar.classList.add('ring-2', 'ring-lime-500', 'ring-offset-2');
        tooltip.textContent = `${data.calories} cal (Today)`;
      }
      
      chartBars.appendChild(bar);
    });
    
    // Render x-axis labels
    this.chartData.forEach(data => {
      const label = document.createElement('span');
      label.className = 'text-xs sm:text-sm';
      
      // Highlight label jika itu adalah hari ini
      if (this.isToday(data.date)) {
        label.className += ' font-bold text-lime-600';
      }
      
      label.textContent = data.dateLabel;
      chartXAxis.appendChild(label);
    });
  }

  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  updateChart() {
    this.loadChartData();
  }

  showLoading() {
    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      chartBars.innerHTML = '<div class="flex items-center justify-center h-72 w-full"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div></div>';
    }
  }

  hideLoading() {
    // Loading will be cleared when renderChart is called
  }

  showError(message) {
    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      chartBars.innerHTML = `<div class="flex items-center justify-center h-72 w-full text-red-600 text-sm">${message}</div>`;
    }
  }
}

export default HistoryPresenter;
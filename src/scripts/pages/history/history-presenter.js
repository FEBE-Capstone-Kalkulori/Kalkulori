class HistoryPresenter {
  constructor(view) {
    this.view = view;
    this.currentWeek = 1;
    this.currentMonth = 'january';
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const monthDropdown = document.getElementById('month-dropdown');
    const weekButtons = document.querySelectorAll('.week-btn');

    monthDropdown.addEventListener('change', (e) => {
      this.currentMonth = e.target.value;
      this.updateChart();
    });

    weekButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentWeek = parseInt(e.target.dataset.week);
        this.updateActiveWeekButton();
        this.updateChart();
      });
    });
  }

  updateActiveWeekButton() {
    const weekButtons = document.querySelectorAll('.week-btn');
    weekButtons.forEach(btn => {
      const week = parseInt(btn.dataset.week);
      
      if (week === this.currentWeek) {
        // Active state
        btn.className = 'week-btn px-6 py-3 bg-lime-600 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5';
      } else {
        // Inactive state
        btn.className = 'week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5';
      }
    });
  }

  updateChart() {
    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      chartBars.innerHTML = '';
    }
  }
}

export default HistoryPresenter;
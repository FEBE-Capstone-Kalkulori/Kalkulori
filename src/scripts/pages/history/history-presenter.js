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
      btn.classList.remove('active');
      if (parseInt(btn.dataset.week) === this.currentWeek) {
        btn.classList.add('active');
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
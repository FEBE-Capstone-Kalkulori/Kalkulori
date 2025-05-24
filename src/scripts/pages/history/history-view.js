class HistoryView {
  getTemplate() {
    return `
      <div class="history-container">
        <div class="history-header">
          <h1>Your Daily Calories Journey</h1>
          <div class="dropdown-container">
            <select id="month-dropdown" class="month-dropdown">
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="february">March</option>
              <option value="february">April</option>
              <option value="february">May</option>
              <option value="february">June</option>
              <option value="february">July</option>
              <option value="february">August</option>
              <option value="february">September</option>
              <option value="february">October</option>
              <option value="february">November</option>
              <option value="february">Desember</option>
            </select>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-area">
            <div class="chart-y-axis">
              <span>2500</span>
              <span>2000</span>
              <span>1500</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>
            <!-- <div class="chart-bars" id="chart-bars"> -->
            </div>
            <div class="chart-x-axis">
              <span>8/5</span>
              <span>9/5</span>
              <span>10/5</span>
              <span>11/5</span>
              <span>12/5</span>
              <span>13/5</span>
              <span>14/5</span>
            </div>
          </div>
        </div>
        
        <div class="week-buttons">
          <button class="week-btn active" data-week="1">Week 1</button>
          <button class="week-btn" data-week="2">Week 2</button>
          <button class="week-btn" data-week="3">Week 3</button>
          <button class="week-btn" data-week="4">Week 4</button>
        </div>
      </div>
    `;
  }
}

export default HistoryView;
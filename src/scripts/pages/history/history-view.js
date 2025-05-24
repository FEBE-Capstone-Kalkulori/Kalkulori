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
            <div class="chart-bars" id="chart-bars">
              <!-- Chart bars akan dirender di sini -->
            </div>
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
        
        <div class="week-buttons">
          <button class="week-btn active" data-week="1">Week 1</button>
          <button class="week-btn" data-week="2">Week 2</button>
          <button class="week-btn" data-week="3">Week 3</button>
          <button class="week-btn" data-week="4">Week 4</button>
        </div>
      </div>
    `;
  }

  // Method untuk membuat header khusus history
  createHistoryHeader() {
    return `
      <div class="history-header-container">
        <div class="history-navbar">
          <div class="history-logo">
            <span class="green-text">kalku</span>lori
          </div>
          <nav>
            <ul class="history-nav-menu">
              <li><a href="#/">Home</a></li>
              <li><a href="#/history" class="active">History</a></li>
              <li><a href="#/profile">Profile</a></li>
            </ul>
          </nav>
        </div>
      </div>
    `;
  }

  // Method untuk hide/show header
  toggleHeaders(showHistoryHeader = true) {
    const homeHeader = document.querySelector('header');
    const existingHistoryHeader = document.querySelector('.history-header-container');
    
    if (showHistoryHeader) {
      // Sembunyikan header home
      if (homeHeader) {
        homeHeader.style.display = 'none';
      }
      
      // Tampilkan header history jika belum ada
      if (!existingHistoryHeader) {
        const historyHeaderHTML = this.createHistoryHeader();
        document.body.insertAdjacentHTML('afterbegin', historyHeaderHTML);
      }
    } else {
      // Tampilkan header home
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
      
      // Hapus header history
      if (existingHistoryHeader) {
        existingHistoryHeader.remove();
      }
    }
  }
}

export default HistoryView;
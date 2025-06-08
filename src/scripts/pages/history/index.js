import HistoryView from './history-view';
import HistoryPresenter from './history-presenter';

const History = {
  async render() {
    return `
      <div class="max-w-7xl mx-auto p-8 bg-white">
        <div class="bg-primary-bg p-8 rounded-2xl min-h-[70vh]">
          <div id="history-container">
            ${new HistoryView().getTemplate()}
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    try {
      // Cleanup sebelum inisialisasi untuk menghindari konflik
      this.onLeave();
      
      // Small delay untuk memastikan DOM ready
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const view = new HistoryView();
      const presenter = new HistoryPresenter(view);
      
      // Toggle headers - show history header, hide home header
      view.toggleHeaders(true);
      
      // Initialize presenter
      presenter.init();
      
      // Simpan reference untuk cleanup
      this.view = view;
      this.presenter = presenter;
      this.isActive = true;
      
    } catch (error) {
      console.error('Error in History afterRender:', error);
      
      // Fallback cleanup jika ada error
      if (this.view) {
        this.view.forceCleanupHeaders();
      }
    }
  },

  // Method untuk cleanup ketika leave history page
  onLeave() {
    try {
      if (this.view) {
        // Kembalikan ke header home, hapus header history
        this.view.toggleHeaders(false);
        
        // Double check dengan force cleanup
        setTimeout(() => {
          if (this.view && !this.isActive) {
            this.view.forceCleanupHeaders();
          }
        }, 100);
      }
      
      // Clear references
      this.view = null;
      this.presenter = null;
      this.isActive = false;
      
    } catch (error) {
      console.error('Error in History onLeave:', error);
      
      // Emergency cleanup
      const historyHeaders = document.querySelectorAll('.kalkulori-history-header');
      historyHeaders.forEach(header => header.remove());
      
      const homeHeader = document.querySelector('header');
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
    }
  },

  // Method untuk force reset jika header stuck
  forceReset() {
    this.onLeave();
    
    // Additional cleanup
    setTimeout(() => {
      const historyHeaders = document.querySelectorAll('.kalkulori-history-header');
      historyHeaders.forEach(header => header.remove());
      
      const homeHeader = document.querySelector('header');
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
    }, 50);
  }
};

// Global error handler untuk header cleanup
window.addEventListener('beforeunload', () => {
  if (History.view) {
    History.onLeave();
  }
});

// Route change handler (jika menggunakan router)
window.addEventListener('hashchange', () => {
  const currentHash = window.location.hash;
  if (!currentHash.includes('history') && History.view) {
    History.onLeave();
  }
});

export default History;
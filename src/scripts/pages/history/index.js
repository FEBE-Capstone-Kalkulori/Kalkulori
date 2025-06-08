import HistoryView from './history-view';
import HistoryPresenter from './history-presenter';
import mealApiService from '../../utils/meal-api-service';

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
      this.onLeave();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (typeof window !== 'undefined') {
        window.mealApiService = mealApiService;
      }
      
      const view = new HistoryView();
      const presenter = new HistoryPresenter(view);
      
      view.toggleHeaders(true);
      
      presenter.init();
      
      this.view = view;
      this.presenter = presenter;
      this.isActive = true;
      
    } catch (error) {
      console.error('Error in History afterRender:', error);
      
      if (this.view) {
        this.view.forceCleanupHeaders();
      }
    }
  },

  onLeave() {
    try {
      if (this.view) {
        this.view.toggleHeaders(false);
        
        setTimeout(() => {
          if (this.view && !this.isActive) {
            this.view.forceCleanupHeaders();
          }
        }, 100);
      }
      
      this.view = null;
      this.presenter = null;
      this.isActive = false;
      
    } catch (error) {
      console.error('Error in History onLeave:', error);
      
      const historyHeaders = document.querySelectorAll('.kalkulori-history-header');
      historyHeaders.forEach(header => header.remove());
      
      const homeHeader = document.querySelector('header');
      if (homeHeader) {
        homeHeader.style.display = 'block';
      }
    }
  },

  forceReset() {
    this.onLeave();
    
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

window.addEventListener('beforeunload', () => {
  if (History.view) {
    History.onLeave();
  }
});

window.addEventListener('hashchange', () => {
  const currentHash = window.location.hash;
  if (!currentHash.includes('history') && History.view) {
    History.onLeave();
  }
});

export default History;
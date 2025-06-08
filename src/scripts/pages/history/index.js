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
    const view = new HistoryView();
    const presenter = new HistoryPresenter(view);
    
    // Toggle headers - show history header, hide home header
    view.toggleHeaders(true);
    
    presenter.init();
    
    // Simpan reference untuk cleanup
    this.view = view;
    this.presenter = presenter;
  },

  // Method untuk cleanup ketika leave history page
  onLeave() {
    if (this.view) {
      // Kembalikan ke header home, hapus header history
      this.view.toggleHeaders(false);
    }
  }
};

export default History;
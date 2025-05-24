import HistoryView from './history-view';
import HistoryPresenter from './history-presenter';

const History = {
  async render() {
    const view = new HistoryView();
    return view.getTemplate();
  },

  async afterRender() {
    const view = new HistoryView();
    const presenter = new HistoryPresenter(view);
    
    // Toggle headers - show history header, hide home header
    view.toggleHeaders(true);
    
    presenter.init();
  },

  // Method untuk cleanup ketika leave history page
  onLeave() {
    const view = new HistoryView();
    // Kembalikan ke header home, hapus header history
    view.toggleHeaders(false);
  }
};

export default History;
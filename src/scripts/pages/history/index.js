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
    presenter.init();
  }
};

export default History;
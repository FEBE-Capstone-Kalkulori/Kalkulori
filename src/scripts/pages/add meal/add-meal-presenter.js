import AddMealView from './add-meal-view';
import { defaultMealsData } from '../../pages/templates/foodCard';
import foodApiService from '../../utils/food-api-service';
import mealApiService from '../../utils/meal-api-service';

class AddMealPresenter {
  constructor({ container }) {
    this.container = container;
    this.data = {
      searchQuery: '',
      meals: [],
      loading: false,
      error: null,
      currentPage: 0,
      maxPages: 5,
      pagination: {
        has_next_page: false,
        has_prev_page: false,
        next_cursor: null,
        prev_cursor: null,
        current_cursor: null
      },
      itemsPerPage: 12,
      cursors: []
    };
    
    this.eventHandlers = {
      onSearchClicked: this._handleSearch.bind(this),
      onBackClicked: this._handleBack.bind(this),
      onPreviousClicked: this._handlePrevious.bind(this),
      onNextClicked: this._handleNext.bind(this)
    };
  }

  async init() {
    try {
      window.mealApiService = mealApiService;
      
      this.data.loading = true;
      this.data.currentPage = 0;
      this.data.cursors = [null];
      this._renderView();
      
      await this._loadFoods();
    } catch (error) {
      console.error('Failed to initialize Add Meal page:', error);
      this.data.error = 'Failed to load foods. Using default data.';
      this.data.meals = defaultMealsData.slice(0, this.data.itemsPerPage);
      this.data.currentPage = 0;
      this.data.cursors = [null];
      this._renderView();
    }
  }

  async _loadFoods(searchQuery = '', targetPage = null, direction = 'next') {
    try {
      this.data.loading = true;
      this.data.error = null;
      this._renderView();

      let result;
      
      if (searchQuery.trim()) {
        result = await foodApiService.searchFoods(searchQuery, 60);
        this.data.meals = foodApiService.formatFoodsForCards(result.foods || result);
        this.data.currentPage = 0;
        this.data.cursors = [null];
        this.data.pagination = {
          has_next_page: false,
          has_prev_page: false,
          next_cursor: null,
          prev_cursor: null,
          current_cursor: null
        };
      } else {
        if (targetPage !== null && targetPage < this.data.currentPage) {
          await this._navigateToPageFromStart(targetPage);
          return;
        }
        
        let cursor = null;
        
        if (targetPage !== null) {
          cursor = this.data.cursors[targetPage] || null;
          this.data.currentPage = targetPage;
        }
        
        result = await foodApiService.getAllFoods({ 
          limit: this.data.itemsPerPage,
          cursor: cursor,
          direction: 'next'
        });
        
        this.data.meals = foodApiService.formatFoodsForCards(result.foods);
        
        if (result.pagination.next_cursor && this.data.currentPage < this.data.maxPages - 1) {
          this.data.cursors[this.data.currentPage + 1] = result.pagination.next_cursor;
        }
        
        this.data.pagination = {
          has_next_page: (result.pagination.has_next_page || this.data.currentPage === 0) && this.data.currentPage < this.data.maxPages - 1,
          has_prev_page: this.data.currentPage > 0,
          next_cursor: result.pagination.next_cursor,
          prev_cursor: result.pagination.prev_cursor,
          current_cursor: result.pagination.current_cursor
        };
      }
      
      if (this.data.meals.length === 0 && !searchQuery.trim() && this.data.currentPage === 0) {
        this.data.meals = defaultMealsData.slice(0, this.data.itemsPerPage);
        this.data.currentPage = 0;
        this.data.cursors = [null];
        this.data.pagination = {
          has_next_page: true,
          has_prev_page: false,
          next_cursor: null,
          prev_cursor: null,
          current_cursor: null
        };
      }

    } catch (error) {
      console.error('Error loading foods:', error);
      this.data.error = 'Failed to load foods from server.';
      
      if (searchQuery.trim()) {
        const filtered = defaultMealsData.filter(meal => 
          meal.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.data.meals = filtered.slice(0, this.data.itemsPerPage);
      } else {
        this.data.meals = defaultMealsData.slice(0, this.data.itemsPerPage);
      }
      
      this.data.currentPage = 0;
      this.data.cursors = [null];
      this.data.pagination = {
        has_next_page: true,
        has_prev_page: false,
        next_cursor: null,
        prev_cursor: null,
        current_cursor: null
      };
    } finally {
      this.data.loading = false;
      this._renderView();
    }
  }

  async _navigateToPageFromStart(targetPage) {
    this.data.currentPage = 0;
    this.data.cursors = [null];
    
    let currentCursor = null;
    let currentPageData = null;
    
    for (let page = 0; page <= targetPage; page++) {
      const result = await foodApiService.getAllFoods({ 
        limit: this.data.itemsPerPage,
        cursor: currentCursor,
        direction: 'next'
      });
      
      if (page === targetPage) {
        this.data.meals = foodApiService.formatFoodsForCards(result.foods);
        this.data.currentPage = targetPage;
        this.data.pagination = {
          has_next_page: result.pagination.has_next_page && targetPage < this.data.maxPages - 1,
          has_prev_page: targetPage > 0,
          next_cursor: result.pagination.next_cursor,
          prev_cursor: result.pagination.prev_cursor,
          current_cursor: result.pagination.current_cursor
        };
      }
      
      if (result.pagination.next_cursor && page < this.data.maxPages - 1) {
        this.data.cursors[page + 1] = result.pagination.next_cursor;
        currentCursor = result.pagination.next_cursor;
      }
    }
  }

  _renderView() {
    AddMealView.render(this.container, this.data);
    AddMealView.afterRender(this.eventHandlers);
  }

  async _handleSearch(query) {
    this.data.searchQuery = query;
    this.data.currentPage = 0;
    this.data.cursors = [null];
    this.data.pagination = {
      has_next_page: false,
      has_prev_page: false,
      next_cursor: null,
      prev_cursor: null,
      current_cursor: null
    };
    console.log(`Searching for: ${query}`);
    
    await this._loadFoods(query);
  }

  async _handlePrevious() {
    if (this.data.currentPage > 0) {
      await this._loadFoods(this.data.searchQuery, this.data.currentPage - 1, 'prev');
    }
  }

  async _handleNext() {
    if (this.data.currentPage < this.data.maxPages - 1 && this.data.pagination.has_next_page) {
      await this._loadFoods(this.data.searchQuery, this.data.currentPage + 1, 'next');
    }
  }

  _handleBack() {
    window.location.hash = '#/';
  }
}

export default AddMealPresenter;
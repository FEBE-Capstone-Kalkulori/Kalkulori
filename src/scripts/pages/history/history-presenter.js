import mealApiService from '../../utils/meal-api-service';

class HistoryPresenter {
  constructor(view) {
    this.view = view;
    this.currentYear = new Date().getFullYear();
    this.chartData = [];
    this.foodHistory = [];
    
    this.initCurrentDateSettings();
  }

  initCurrentDateSettings() {
    const today = new Date();
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    this.currentMonth = monthNames[today.getMonth()];
    this.currentWeek = this.calculateCurrentWeekInMonth(today);
  }

  calculateCurrentWeekInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    const weekNumber = Math.ceil((day + firstDayOfWeek) / 7);
    
    return Math.min(weekNumber, 4);
  }

  init() {
    console.log('🚀 Initializing History Presenter...');
    
    // Check if DOM elements exist
    const container = document.getElementById('history-food-container');
    const monthDropdown = document.getElementById('month-dropdown');
    const chartBars = document.getElementById('chart-bars');
    
    console.log('🔍 DOM Elements Check:', {
      foodContainer: !!container,
      monthDropdown: !!monthDropdown, 
      chartBars: !!chartBars
    });
    
    this.setInitialMonthDropdown();
    this.bindEvents();
    this.updateActiveWeekButton();
    this.loadChartData();
    
    // Load food history dengan delay untuk memastikan DOM ready
    setTimeout(() => {
      console.log('⏰ Starting food history load...');
      this.loadFoodHistory();
    }, 100);
  }

  setInitialMonthDropdown() {
    const monthDropdown = document.getElementById('month-dropdown');
    if (monthDropdown) {
      monthDropdown.value = this.currentMonth;
    }
  }

  bindEvents() {
    const monthDropdown = document.getElementById('month-dropdown');
    const weekButtons = document.querySelectorAll('.week-btn');

    monthDropdown.addEventListener('change', (e) => {
      this.currentMonth = e.target.value;
      this.loadChartData();
    });

    weekButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentWeek = parseInt(e.target.dataset.week);
        this.updateActiveWeekButton();
        this.loadChartData();
      });
    });
  }

  updateActiveWeekButton() {
    const weekButtons = document.querySelectorAll('.week-btn');
    weekButtons.forEach(btn => {
      const week = parseInt(btn.dataset.week);
      
      if (week === this.currentWeek) {
        btn.className = 'week-btn px-6 py-3 bg-lime-600 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-700 hover:-translate-y-0.5';
      } else {
        btn.className = 'week-btn px-6 py-3 bg-lime-300 text-amber-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-lime-400 hover:-translate-y-0.5';
      }
    });
  }

  getMonthNumber(monthName) {
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    return months[monthName];
  }

  getWeekDates() {
    const monthNum = this.getMonthNumber(this.currentMonth);
    const year = this.currentYear;
    
    const firstDay = new Date(year, monthNum, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    const weekStart = new Date(firstDay);
    weekStart.setDate(1 - firstDayOfWeek + (this.currentWeek - 1) * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  }

  formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadChartData() {
    try {
      this.showLoading();
      
      const weekDates = this.getWeekDates();
      const chartData = [];
      
      for (const date of weekDates) {
        const dateStr = this.formatDateForAPI(date);
        
        try {
          const dailyData = await mealApiService.getDailyLog(dateStr);
          const calories = dailyData.daily_log?.total_calories_consumed || 0;
          
          chartData.push({
            date: date,
            dateLabel: this.formatDate(date),
            calories: calories
          });
        } catch (error) {
          chartData.push({
            date: date,
            dateLabel: this.formatDate(date),
            calories: 0
          });
        }
      }
      
      this.chartData = chartData;
      this.renderChart();
      
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.showError('Failed to load chart data');
    } finally {
      this.hideLoading();
    }
  }

  async loadFoodHistory() {
    try {
      console.log('🔄 Loading food history...');
      this.showFoodLoading();
      
      const allMealEntries = await mealApiService.getMealEntries({});
      console.log('📊 Meal entries received:', allMealEntries);
      
      if (!allMealEntries || allMealEntries.length === 0) {
        console.log('❌ No meal entries found');
        this.showFoodError('No meal history found');
        return;
      }
      
      const uniqueFoods = new Map();
      
      allMealEntries.forEach((entry, index) => {
        console.log(`📝 Processing entry ${index}:`, entry);
        
        // Berdasarkan backend structure: food data ada di 'food_details'
        let foodItem = null;
        if (entry.food_details) {
          foodItem = entry.food_details;
        } else if (entry.food_item) {
          foodItem = entry.food_item;
        } else if (entry.foodItem) {
          foodItem = entry.foodItem;
        } else if (entry.food) {
          foodItem = entry.food;
        }
        
        if (foodItem && (foodItem.id || foodItem.food_id || entry.food_item_id)) {
          const foodId = foodItem.id || foodItem.food_id || entry.food_item_id;
          if (!uniqueFoods.has(foodId)) {
            const foodData = {
              id: foodId,
              name: foodItem.name || foodItem.food_name || 'Unknown Food',
              calories: Math.round(foodItem.calories_per_serving || foodItem.calories || foodItem.total_calories || 0),
              image: foodItem.image_url || foodItem.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
              serving_size: foodItem.default_serving_size || foodItem.serving_size || 1,
              serving_unit: foodItem.serving_unit || foodItem.unit || 'serving'
            };
            
            console.log(`✅ Added unique food:`, foodData);
            uniqueFoods.set(foodId, foodData);
          }
        } else {
          console.log(`⚠️  Entry ${index} structure:`, {
            hasFood_details: !!entry.food_details,
            hasFood_item: !!entry.food_item,
            food_item_id: entry.food_item_id,
            entry: entry
          });
        }
      });
      
      this.foodHistory = Array.from(uniqueFoods.values()).slice(0, 12);
      console.log('🍽️ Final food history:', this.foodHistory);
      
      if (this.foodHistory.length === 0) {
        console.log('📝 No food history found, using sample data...');
        
        // Fallback ke sample data jika tidak ada history
        this.foodHistory = [
          {
            id: "sample_1",
            name: "Fried Chicken Wings",
            calories: 320,
            image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            serving_size: 1,
            serving_unit: "serving"
          },
          {
            id: "sample_2", 
            name: "Fried Rice with Egg",
            calories: 270,
            image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            serving_size: 1,
            serving_unit: "serving"
          },
          {
            id: "sample_3",
            name: "Chicken Soto", 
            calories: 312,
            image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            serving_size: 1,
            serving_unit: "serving"
          }
        ];
        
        this.renderFoodHistory();
      } else {
        this.renderFoodHistory();
      }
      
    } catch (error) {
      console.error('💥 Error loading food history:', error);
      this.showFoodError('Failed to load food history');
    }
  }

  renderFoodHistory() {
    const container = document.getElementById('history-food-container');
    console.log('🎨 Rendering food history, container:', container);
    console.log('🍽️ Food history to render:', this.foodHistory);
    
    if (!container) {
      console.error('❌ Food container not found!');
      return;
    }
    
    if (this.foodHistory.length === 0) {
      container.innerHTML = '<div class="text-center text-gray-500 py-8 text-sm">No food history found</div>';
      return;
    }
    
    container.innerHTML = '';
    
    this.foodHistory.forEach((food, index) => {
      console.log(`🔄 Creating card ${index} for:`, food);
      const foodCard = this.createSmallFoodCard(food);
      container.appendChild(foodCard);
    });
    
    console.log('✅ Food cards rendered, binding events...');
    this.bindFoodCardEvents();
  }

  createSmallFoodCard(food) {
    const cardElement = document.createElement('div');
    cardElement.className = 'bg-gray-50 rounded-2xl p-3 flex items-center gap-3 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-gray-200';
    cardElement.dataset.foodId = food.id;
    cardElement.dataset.servingSize = food.serving_size;
    cardElement.dataset.servingUnit = food.serving_unit;
    
    cardElement.innerHTML = `
      <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
        <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200">
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-sm text-gray-900 truncate">${food.name}</h4>
        <p class="text-xs text-gray-600">${food.calories} kcal</p>
      </div>
      <button class="w-8 h-8 bg-lime-500 text-white rounded-full flex items-center justify-center hover:bg-lime-600 hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 border-none outline-none">
        <span class="text-sm font-bold">+</span>
      </button>
    `;
    
    return cardElement;
  }

  bindFoodCardEvents() {
    const container = document.getElementById('history-food-container');
    if (!container) return;
    
    const addButtons = container.querySelectorAll('button');
    addButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const foodCard = event.target.closest('[data-food-id]');
        if (!foodCard) return;
        
        const foodName = foodCard.querySelector('h4').textContent;
        const caloriesText = foodCard.querySelector('p').textContent;
        const calories = parseInt(caloriesText.replace(' kcal', ''));
        const foodId = foodCard.dataset.foodId;
        const servingSize = foodCard.dataset.servingSize;
        const servingUnit = foodCard.dataset.servingUnit;
        
        this.showAddMealPopup({
          id: foodId,
          name: foodName,
          calories: calories,
          serving_size: servingSize,
          serving_unit: servingUnit
        });
      });
    });
  }

  showAddMealPopup(foodData) {
    const existingPopup = document.getElementById('meal-popup-overlay');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    const popupHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" id="meal-popup-overlay">
        <div class="bg-white rounded-2xl p-6 w-96 max-w-90vw animate-in zoom-in-95 duration-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-900">Add ${foodData.name}</h3>
            <button class="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200" id="popup-close">&times;</button>
          </div>
          <div class="space-y-4">
            <div>
              <label for="meal-type" class="block text-sm font-medium text-gray-700 mb-1">Meal Type:</label>
              <select id="meal-type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200">
                <option value="">Select meal type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label for="servings" class="block text-sm font-medium text-gray-700 mb-1">Servings:</label>
              <input type="number" id="servings" min="1" step="1" value="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200">
            </div>
            <div>
              <label for="log-date" class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
              <input type="date" id="log-date" value="${new Date().toISOString().split('T')[0]}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200">
            </div>
            <div class="flex gap-3 mt-6">
              <button class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200" id="btn-cancel">Cancel</button>
              <button class="flex-1 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 active:bg-lime-700 transition-all duration-200" id="btn-add">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const overlay = document.getElementById('meal-popup-overlay');
    const closeBtn = document.getElementById('popup-close');
    const cancelBtn = document.getElementById('btn-cancel');
    const addBtn = document.getElementById('btn-add');
    
    const closePopup = () => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
    
    closeBtn?.addEventListener('click', closePopup);
    cancelBtn?.addEventListener('click', closePopup);
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });
    
    addBtn?.addEventListener('click', async () => {
      const mealType = document.getElementById('meal-type')?.value;
      const servings = parseFloat(document.getElementById('servings')?.value);
      const logDate = document.getElementById('log-date')?.value;
      
      if (!mealType || !servings || !logDate) {
        alert('Please fill all fields');
        return;
      }
      
      try {
        addBtn.disabled = true;
        addBtn.textContent = 'Adding...';
        
        await mealApiService.createMealEntry({
          food_item_id: foodData.id,
          meal_type: mealType,
          servings: servings,
          log_date: logDate
        });
        
        alert('Meal added successfully!');
        closePopup();
        
        if (logDate === new Date().toISOString().split('T')[0]) {
          this.loadChartData();
        }
        
      } catch (error) {
        console.error('Error adding meal:', error);
        alert('Failed to add meal. Please try again.');
        addBtn.disabled = false;
        addBtn.textContent = 'Add';
      }
    });
  }

  renderChart() {
    const chartBars = document.getElementById('chart-bars');
    const chartXAxis = document.querySelector('.chart-x-axis');
    
    if (!chartBars || !chartXAxis) return;
    
    chartBars.innerHTML = '';
    chartXAxis.innerHTML = '';
    
    const maxCalories = Math.max(...this.chartData.map(d => d.calories), 2500);
    const chartHeight = 288;
    
    this.chartData.forEach((data, index) => {
      const barHeight = data.calories > 0 ? (data.calories / maxCalories) * chartHeight : 0;
      
      const bar = document.createElement('div');
      bar.className = 'bg-amber-800 w-8 sm:w-12 mx-1 rounded-t-sm transition-all duration-300 hover:bg-amber-700 cursor-pointer relative group';
      bar.style.height = `${barHeight}px`;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10';
      tooltip.textContent = `${data.calories} cal`;
      bar.appendChild(tooltip);
      
      if (this.isToday(data.date)) {
        bar.classList.add('ring-2', 'ring-lime-500', 'ring-offset-2');
        tooltip.textContent = `${data.calories} cal (Today)`;
      }
      
      chartBars.appendChild(bar);
    });
    
    this.chartData.forEach(data => {
      const label = document.createElement('span');
      label.className = 'text-xs sm:text-sm';
      
      if (this.isToday(data.date)) {
        label.className += ' font-bold text-lime-600';
      }
      
      label.textContent = data.dateLabel;
      chartXAxis.appendChild(label);
    });
  }

  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  updateChart() {
    this.loadChartData();
  }

  showLoading() {
    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      chartBars.innerHTML = '<div class="flex items-center justify-center h-72 w-full"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div></div>';
    }
  }

  showFoodLoading() {
    const container = document.getElementById('history-food-container');
    if (container) {
      container.innerHTML = '<div class="flex items-center justify-center h-40 text-gray-500"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div></div>';
    }
  }

  hideLoading() {
  }

  showError(message) {
    const chartBars = document.getElementById('chart-bars');
    if (chartBars) {
      chartBars.innerHTML = `<div class="flex items-center justify-center h-72 w-full text-red-600 text-sm">${message}</div>`;
    }
  }

  showFoodError(message) {
    const container = document.getElementById('history-food-container');
    if (container) {
      container.innerHTML = `<div class="text-center text-gray-500 py-8 text-sm">${message}</div>`;
    }
  }
}

export default HistoryPresenter;
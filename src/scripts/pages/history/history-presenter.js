import mealApiService from '../../utils/meal-api-service';

class HistoryPresenter {
  constructor(view) {
    this.view = view;
    this.currentYear = new Date().getFullYear();
    this.chartData = [];
    this.foodHistory = [];
    this.selectedDate = new Date();
    
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
    
    setTimeout(() => {
      console.log('⏰ Starting food history load for today...');
      this.loadFoodHistory(this.formatDateForAPI(new Date()));
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

  // FIX: Enhanced _enrichMealEntries for better image and calories handling
  async _enrichMealEntries(mealEntries) {
    const enrichedEntries = [];
    
    for (const meal of mealEntries) {
      let enrichedMeal = { ...meal };
      
      // FIX: Ensure proper field mapping like in home-presenter
      if (!enrichedMeal.calories && enrichedMeal.calories_consumed) {
        enrichedMeal.calories = enrichedMeal.calories_consumed;
      }
      if (!enrichedMeal.protein && enrichedMeal.protein_consumed) {
        enrichedMeal.protein = enrichedMeal.protein_consumed;
      }
      if (!enrichedMeal.carbs && enrichedMeal.carbs_consumed) {
        enrichedMeal.carbs = enrichedMeal.carbs_consumed;
      }
      if (!enrichedMeal.fat && enrichedMeal.fat_consumed) {
        enrichedMeal.fat = enrichedMeal.fat_consumed;
      }
      
      // FIX: Enhanced handling for recipe and search meals with proper image fetching
      if ((meal.is_from_recipe || meal.is_from_search) && meal.recipe_id) {
        try {
          console.log(`🔍 Fetching details for ${meal.is_from_search ? 'search' : 'recipe'} meal:`, meal.recipe_id);
          
          const mealDetails = await mealApiService.getMealDetails(meal.recipe_id);
          if (mealDetails && mealDetails.meal) {
            const recipeData = mealDetails.meal;
            enrichedMeal.food_details = {
              id: meal.is_from_search ? meal.food_item_id : `recipe_${meal.recipe_id}`,
              food_name: recipeData.food_name || meal.food_name || (meal.is_from_search ? 'Search Result' : 'Recipe Meal'),
              calories_per_serving: recipeData.calories_per_serving,
              protein_per_serving: recipeData.protein_per_serving,
              carbs_per_serving: recipeData.carbs_per_serving,
              fat_per_serving: recipeData.fat_per_serving,
              serving_size: recipeData.serving_size,
              serving_unit: recipeData.serving_unit,
              image_url: recipeData.image_url, // FIX: Keep the actual image from API
              is_recipe: meal.is_from_recipe ? true : false,
              is_from_search: meal.is_from_search ? true : false,
              recipe_id: meal.recipe_id
            };
            console.log(`✅ Successfully enriched ${meal.is_from_search ? 'search' : 'recipe'} meal with image:`, enrichedMeal.food_details.image_url);
          } else {
            throw new Error('No meal details found');
          }
        } catch (error) {
          console.warn(`⚠️ Could not fetch ${meal.is_from_search ? 'search' : 'recipe'} meal details:`, error);
          
          // FIX: Better fallback with proper calorie calculation
          const caloriesPerServing = Math.round((meal.calories || meal.calories_consumed || 0) / (meal.servings || 1));
          const proteinPerServing = parseFloat(((meal.protein || meal.protein_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const carbsPerServing = parseFloat(((meal.carbs || meal.carbs_consumed || 0) / (meal.servings || 1)).toFixed(2));
          const fatPerServing = parseFloat(((meal.fat || meal.fat_consumed || 0) / (meal.servings || 1)).toFixed(2));
          
          enrichedMeal.food_details = {
            id: meal.food_item_id,
            food_name: meal.food_name || (meal.is_from_search ? 'Search Result' : 'Recipe Meal'),
            calories_per_serving: caloriesPerServing,
            protein_per_serving: proteinPerServing,
            carbs_per_serving: carbsPerServing,
            fat_per_serving: fatPerServing,
            serving_size: 1,
            serving_unit: "serving",
            image_url: null, // Will use fallback in UI
            is_recipe: meal.is_from_recipe ? true : false,
            is_from_search: meal.is_from_search ? true : false,
            recipe_id: meal.recipe_id
          };
          console.log(`⚠️ Using fallback data for ${meal.is_from_search ? 'search' : 'recipe'} meal:`, enrichedMeal.food_details.food_name);
        }
      } else if (meal.food_details) {
        // Regular food items with existing food_details
        enrichedMeal.food_details = meal.food_details;
      } else {
        // FIX: Better fallback for regular foods without food_details
        const caloriesPerServing = Math.round((meal.calories || meal.calories_consumed || 0) / (meal.servings || 1));
        const proteinPerServing = parseFloat(((meal.protein || meal.protein_consumed || 0) / (meal.servings || 1)).toFixed(2));
        const carbsPerServing = parseFloat(((meal.carbs || meal.carbs_consumed || 0) / (meal.servings || 1)).toFixed(2));
        const fatPerServing = parseFloat(((meal.fat || meal.fat_consumed || 0) / (meal.servings || 1)).toFixed(2));
        
        enrichedMeal.food_details = {
          id: meal.food_item_id,
          food_name: meal.food_name || 'Unknown Food',
          calories_per_serving: caloriesPerServing,
          protein_per_serving: proteinPerServing,
          carbs_per_serving: carbsPerServing,
          fat_per_serving: fatPerServing,
          serving_size: 1,
          serving_unit: "serving",
          image_url: null
        };
      }
      
      enrichedEntries.push(enrichedMeal);
    }
    
    return enrichedEntries;
  }

  async loadFoodHistory(logDate = null) {
    try {
      this.showFoodLoading();
      
      const targetDate = logDate || this.formatDateForAPI(new Date());
      console.log('📅 Loading food history for date:', targetDate);
      
      const dailyData = await mealApiService.getDailyLog(targetDate);
      
      if (!dailyData || !dailyData.meal_entries || dailyData.meal_entries.length === 0) {
        this.showFoodError(`No meals found for ${this.formatDisplayDate(targetDate)}`);
        return;
      }
      
      console.log('📊 Raw meal entries from API:', dailyData.meal_entries);
      
      const enrichedMealEntries = await this._enrichMealEntries(dailyData.meal_entries);
      console.log('✨ Enriched meal entries:', enrichedMealEntries);
      
      const uniqueFoods = new Map();
      
      enrichedMealEntries.forEach((entry, index) => {
        let foodItem = null;
        let foodName = 'Unknown Food';
        
        if (entry.food_details) {
          foodItem = entry.food_details;
          foodName = foodItem.food_name || foodItem.name || entry.food_name || 'Recipe Meal';
        } else if (entry.food_item) {
          foodItem = entry.food_item;
          foodName = foodItem.food_name || foodItem.name || entry.food_name || 'Food Item';
        } else if (entry.food_name) {
          foodName = entry.food_name;
        } else if (entry.food_item_id) {
          foodName = `Food ${entry.food_item_id}`;
        }
        
        if (foodItem || entry.food_item_id) {
          const foodId = foodItem?.id || entry.food_item_id;
          const entryKey = `${foodId}_${entry.meal_type}_${entry.id}`;
          
          if (!uniqueFoods.has(entryKey)) {
            // FIX: Better calorie calculation with multiple fallbacks
            let totalCalories = 0;
            
            // Try different methods to get calories
            if (entry.calories) {
              totalCalories = Math.round(entry.calories);
            } else if (entry.calories_consumed) {
              totalCalories = Math.round(entry.calories_consumed);
            } else if (foodItem && foodItem.calories_per_serving && entry.servings) {
              totalCalories = Math.round(foodItem.calories_per_serving * entry.servings);
            } else if (foodItem && foodItem.calories_per_serving) {
              totalCalories = Math.round(foodItem.calories_per_serving);
            } else {
              totalCalories = 0;
            }
            
            // FIX: Better image handling with proper fallback
            let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
            
            if (foodItem && foodItem.image_url) {
              imageUrl = foodItem.image_url;
            } else {
              // Use more specific fallback images based on meal type
              const fallbackImages = {
                breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                dinner: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                snack: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              };
              imageUrl = fallbackImages[entry.meal_type] || imageUrl;
            }
            
            const foodData = {
              id: foodId,
              entryId: entry.id,
              name: foodName,
              calories: totalCalories,
              image: imageUrl,
              serving_size: entry.servings || 1,
              serving_unit: foodItem?.serving_unit || 'serving',
              meal_type: entry.meal_type
            };
            
            console.log(`🍽️ Created food card data:`, foodData);
            
            uniqueFoods.set(entryKey, foodData);
          }
        }
      });
      
      this.foodHistory = Array.from(uniqueFoods.values()).slice(0, 12);
      
      console.log('📋 Final food history:', this.foodHistory);
      
      if (this.foodHistory.length === 0) {
        this.showFoodError(`No meals found for ${this.formatDisplayDate(targetDate)}`);
      } else {
        this.renderFoodHistory();
      }
      
    } catch (error) {
      console.error('💥 Error loading food history:', error);
      
      if (error.message && error.message.includes('404')) {
        this.showFoodError(`No meals found for ${this.formatDisplayDate(logDate || this.formatDateForAPI(new Date()))}`);
      } else {
        this.showFoodError('Failed to load food history');
      }
    }
  }

  formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    
    if (this.isSameDate(date, today)) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (this.isSameDate(date, yesterday)) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  }

  onBarClick(dateData) {
    this.selectedDate = dateData.date;
    const dateStr = this.formatDateForAPI(dateData.date);
    console.log('📅 Bar clicked for date:', dateStr);
    this.loadFoodHistory(dateStr);
    
    this.updateSelectedBar();
  }

  updateSelectedBar() {
    const chartBars = document.getElementById('chart-bars');
    if (!chartBars) return;
    
    const bars = chartBars.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
      const barData = this.chartData[index];
      if (barData && this.isSameDate(barData.date, this.selectedDate)) {
        bar.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      } else if (!this.isToday(barData?.date)) {
        bar.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }
    });
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
        <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-sm text-gray-900 truncate">${food.name}</h4>
        <div class="flex items-center gap-2">
          <p class="text-xs text-gray-600">${food.calories} kcal</p>
          <span class="text-xs px-2 py-0.5 bg-lime-100 text-lime-700 rounded-full">${food.meal_type}</span>
        </div>
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
        
        // FIX: Force refresh both history and chart data
        setTimeout(() => {
          if (logDate === this.formatDateForAPI(this.selectedDate)) {
            this.loadFoodHistory(logDate);
          }
          this.loadChartData();
        }, 500);
        
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
      bar.className = 'chart-bar bg-amber-800 w-8 sm:w-12 mx-1 rounded-t-sm transition-all duration-300 hover:bg-amber-700 cursor-pointer relative group';
      bar.style.height = `${barHeight}px`;
      
      bar.addEventListener('click', () => {
        this.onBarClick(data);
      });
      
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

    this.updateSelectedBar();
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
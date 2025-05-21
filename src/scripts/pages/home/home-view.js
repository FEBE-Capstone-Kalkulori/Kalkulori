const createHomeTemplate = (data) => {
  return `
    <div class="page-outer-wrapper">
      <div class="page-inner-wrapper">
        <div class="content-layout">
          <div class="left-column">
            <div class="content-box daily-calories-box">
              <h2>Daily Calories</h2>
              <div class="calorie-counter">
                <div class="calorie-display">
                  <div class="calorie-number">${data.currentCalories}</div>
                  <div class="calorie-remaining">${data.calorieLimit - data.currentCalories} kcal left!</div>
                </div>
                <button class="add-meal-btn" id="add-meal-button">Add Meal</button>
              </div>
            </div>

            <div class="content-box meal-plan-box">
              <h2>Meal Plan</h2>
              <div class="meal-plan-header">
                <div class="meal-title">Meal 1</div>
                <div class="meal-calorie-info">1200 kcal/<span class="calorie-limit-text">1500</span></div>
              </div>
              <div class="meal-plan-items">
                <div class="meal-item">
                  <div class="meal-item-image">
                    <img src="./public/image/meals/fried-chicken-wings.jpg" alt="Fried Chicken Wings">
                  </div>
                  <div class="meal-item-label">Breakfast</div>
                  <div class="meal-item-name">Fried Chicken Wings</div>
                </div>
                
                <div class="meal-item">
                  <div class="meal-item-image">
                    <img src="./public/image/meals/fried-rice-egg.jpg" alt="Fried Rice with Egg">
                  </div>
                  <div class="meal-item-label">Lunch</div>
                  <div class="meal-item-name">Fried Rice with Egg</div>
                </div>
                
                <div class="meal-item">
                  <div class="meal-item-image">
                    <img src="./public/image/meals/soto-ayam.jpg" alt="Soto Ayam">
                  </div>
                  <div class="meal-item-label">Dinner</div>
                  <div class="meal-item-name">Soto Ayam</div>
                </div>
              </div>
            </div>
          </div>

          <div class="right-column">
            <div class="content-box suggestion-box">
              <h2>Suggestion Meals</h2>
              <div class="suggestion-input">
                <div class="suggestion-question">What do you want to eat today?</div>
                <button class="suggestion-option" id="savory-option">savory</button>
                <button class="suggestion-done" id="suggestion-done">Done</button>
              </div>
            </div>

            <div class="suggestions-grid">
              <div class="suggestion-meal-item">
                <div class="suggestion-meal-image">
                  <img src="./public/image/meals/chicken-soto.jpg" alt="Chicken Soto">
                </div>
                <div class="suggestion-meal-details">
                  <div class="suggestion-meal-name">Chicken Soto</div>
                  <div class="suggestion-meal-calories">312 kcal</div>
                </div>
              </div>
              
              <div class="suggestion-meal-item">
                <div class="suggestion-meal-image">
                  <img src="./public/image/meals/fried-noodles.jpg" alt="Fried Noodles">
                </div>
                <div class="suggestion-meal-details">
                  <div class="suggestion-meal-name">Fried Noodles</div>
                  <div class="suggestion-meal-calories">280 kcal</div>
                </div>
              </div>
              
              <div class="suggestion-meal-item">
                <div class="suggestion-meal-image">
                  <img src="./public/image/meals/meatballs-soup.jpg" alt="Meatballs Soup">
                </div>
                <div class="suggestion-meal-details">
                  <div class="suggestion-meal-name">Meatballs Soup</div>
                  <div class="suggestion-meal-calories">283 kcal</div>
                </div>
              </div>
              
              <div class="suggestion-meal-item">
                <div class="suggestion-meal-image">
                  <img src="./public/image/meals/noodles-soup.jpg" alt="Noodles Soup">
                </div>
                <div class="suggestion-meal-details">
                  <div class="suggestion-meal-name">Noodles Soup</div>
                  <div class="suggestion-meal-calories">137 kcal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default {
  render(container, data) {
    container.innerHTML = createHomeTemplate(data);
  },
  
  afterRender(eventHandlers) {
    const addMealButton = document.getElementById('add-meal-button');
    const savoryOption = document.getElementById('savory-option');
    const suggestionDone = document.getElementById('suggestion-done');
    
    if (addMealButton && eventHandlers.onAddMealClicked) {
      addMealButton.addEventListener('click', eventHandlers.onAddMealClicked);
    }
    
    if (savoryOption && eventHandlers.onSuggestionOptionClicked) {
      savoryOption.addEventListener('click', () => {
        eventHandlers.onSuggestionOptionClicked('savory');
      });
    }
    
    if (suggestionDone && eventHandlers.onSuggestionDoneClicked) {
      suggestionDone.addEventListener('click', eventHandlers.onSuggestionDoneClicked);
    }
  }
};
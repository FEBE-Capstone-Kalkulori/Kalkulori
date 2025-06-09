function createFoodCard(imageUrl, foodName, calories, foodId = null, servingSize = null, servingUnit = null, isFromSearch = false, recipeId = null, protein = null, carbs = null, fat = null) {
    return `
        <div class="food-card" 
             data-food-id="${foodId || ''}" 
             data-recipe-id="${recipeId || ''}"
             data-serving-size="${servingSize || 1}" 
             data-serving-unit="${servingUnit || 'serving'}"
             data-is-from-search="${isFromSearch}"
             data-calories="${calories || 0}"
             data-protein="${protein || 0}"
             data-carbs="${carbs || 0}"
             data-fat="${fat || 0}"
             data-food-name="${foodName}">
            <div class="food-image">
                <img src="${imageUrl}" alt="${foodName}">
            </div>
            <div class="food-info">
                <h3 class="food-name">${foodName}</h3>
                <p class="food-calories">${calories} kcal</p>
            </div>
            <button class="add-button">
                <span class="plus-icon">+</span>
            </button>
        </div>
    `;
}

function renderFoodCards(foodData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    foodData.forEach(food => {
        const cardHTML = createFoodCard(
            food.image, 
            food.name, 
            food.calories, 
            food.id,
            food.serving_size,
            food.serving_unit,
            food.is_from_search,
            food.recipe_id,
            food.protein,
            food.carbs,
            food.fat
        );
        container.innerHTML += cardHTML;
    });
    
    bindFoodCardEvents(containerId);
}

function bindFoodCardEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const newButtons = container.querySelectorAll('.add-button');
    newButtons.forEach(button => {
        button.removeEventListener('click', handleAddButtonClick);
        button.addEventListener('click', handleAddButtonClick);
    });
    
    const foodCards = container.querySelectorAll('.food-card');
    foodCards.forEach(card => {
        card.removeEventListener('click', handleFoodCardClick);
        card.addEventListener('click', handleFoodCardClick);
        card.style.cursor = 'pointer';
    });
}

function handleAddButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const foodCard = event.target.closest('.food-card');
    if (!foodCard) return;
    
    const foodName = foodCard.dataset.foodName || foodCard.querySelector('.food-name')?.textContent || 'Unknown Food';
    const foodCalories = parseInt(foodCard.dataset.calories) || 0;
    const foodProtein = parseFloat(foodCard.dataset.protein) || 0;
    const foodCarbs = parseFloat(foodCard.dataset.carbs) || 0;
    const foodFat = parseFloat(foodCard.dataset.fat) || 0;
    const foodId = foodCard.dataset.foodId || null;
    const recipeId = foodCard.dataset.recipeId || null;
    const servingSize = foodCard.dataset.servingSize || 1;
    const servingUnit = foodCard.dataset.servingUnit || 'serving';
    const isFromSearch = foodCard.dataset.isFromSearch === 'true';
    const imageUrl = foodCard.querySelector('.food-image img')?.src || null;
    
    console.log('Add button clicked for:', { foodName, foodCalories, foodId, recipeId, isFromSearch });
    
    showAddMealPopup({
        id: foodId,
        recipe_id: recipeId,
        name: foodName,
        calories: foodCalories,
        protein: foodProtein,
        carbs: foodCarbs,
        fat: foodFat,
        serving_size: servingSize,
        serving_unit: servingUnit,
        is_from_search: isFromSearch,
        image: imageUrl
    });
}

function handleFoodCardClick(event) {
    if (event.target.closest('.add-button')) {
        return;
    }
    
    const foodCard = event.target.closest('.food-card');
    if (!foodCard) return;
    
    const foodName = foodCard.dataset.foodName || foodCard.querySelector('.food-name')?.textContent || 'Unknown Food';
    const foodCalories = parseInt(foodCard.dataset.calories) || 0;
    const foodProtein = parseFloat(foodCard.dataset.protein) || 0;
    const foodCarbs = parseFloat(foodCard.dataset.carbs) || 0;
    const foodFat = parseFloat(foodCard.dataset.fat) || 0;
    const servingSize = foodCard.dataset.servingSize || 1;
    const servingUnit = foodCard.dataset.servingUnit || 'serving';
    const imageUrl = foodCard.querySelector('.food-image img')?.src || null;
    
    showFoodDetailsPopup({
        name: foodName,
        calories: foodCalories,
        protein: foodProtein,
        carbs: foodCarbs,
        fat: foodFat,
        serving_size: servingSize,
        serving_unit: servingUnit,
        image: imageUrl
    });
}

function showFoodDetailsPopup(foodData) {
    console.log('Showing food details for:', foodData);
    
    const existingPopup = document.getElementById('food-details-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popupHTML = `
        <div class="food-details-overlay" id="food-details-overlay">
            <div class="food-details-popup">
                <div class="food-details-header">
                    <h3>${foodData.name}</h3>
                    <button class="popup-close" id="details-close">&times;</button>
                </div>
                <div class="food-details-content">
                    ${foodData.image ? `
                        <div class="food-details-image">
                            <img src="${foodData.image}" alt="${foodData.name}">
                        </div>
                    ` : ''}
                    <div class="nutrition-info">
                        <h4>Nutrition Facts</h4>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-label">Calories</span>
                                <span class="nutrition-value">${foodData.calories} kcal</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Protein</span>
                                <span class="nutrition-value">${foodData.protein}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Carbs</span>
                                <span class="nutrition-value">${foodData.carbs}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Fat</span>
                                <span class="nutrition-value">${foodData.fat}g</span>
                            </div>
                        </div>
                        <div class="serving-info">
                            <p><strong>Serving Size:</strong> ${foodData.serving_size} ${foodData.serving_unit}</p>
                        </div>
                    </div>
                    <div class="details-actions">
                        <button class="btn-close-details" id="btn-close-details">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const overlay = document.getElementById('food-details-overlay');
    const closeBtn = document.getElementById('details-close');
    const closeDetailsBtn = document.getElementById('btn-close-details');
    
    function closePopup() {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closePopup);
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closePopup();
        });
    }
}

function showAddMealPopup(foodData) {
    console.log('Showing popup for:', foodData);
    
    const existingPopup = document.getElementById('meal-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popupHTML = `
        <div class="meal-popup-overlay" id="meal-popup-overlay">
            <div class="meal-popup">
                <div class="meal-popup-header">
                    <h3>Add ${foodData.name}</h3>
                    <button class="popup-close" id="popup-close">&times;</button>
                </div>
                <div class="meal-popup-content">
                    <div class="form-group">
                        <label for="meal-type">Meal Type:</label>
                        <select id="meal-type" required>
                            <option value="">Select meal type</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="servings">Servings:</label>
                        <input type="number" id="servings" min="1" step="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="log-date">Date:</label>
                        <input type="date" id="log-date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-actions">
                        <button class="btn-cancel" id="btn-cancel">Cancel</button>
                        <button class="btn-add" id="btn-add">Add</button>
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
    
    function closePopup() {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePopup);
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closePopup();
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', async function() {
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
                
                if (foodData.is_from_search && foodData.recipe_id) {
                    if (window.foodApiService) {
                        await window.foodApiService.addFoodFromSearch({
                            recipe_id: foodData.recipe_id,
                            food_name: foodData.name,
                            calories_per_serving: foodData.calories,
                            protein_per_serving: foodData.protein,
                            carbs_per_serving: foodData.carbs,
                            fat_per_serving: foodData.fat,
                            serving_size: foodData.serving_size,
                            serving_unit: foodData.serving_unit,
                            meal_type: mealType,
                            servings: servings,
                            log_date: logDate,
                            image_url: foodData.image
                        });
                        
                        alert('Meal added successfully!');
                        closePopup();
                        
                        if (window.location.hash === '#/' || window.location.hash === '#/home') {
                            window.location.reload();
                        }
                    } else {
                        console.log(`Added search result ${foodData.name} - ${mealType} - ${servings} servings on ${logDate}`);
                        alert('Demo: Search meal would be added to your log!');
                        closePopup();
                    }
                } else if (window.mealApiService && foodData.id) {
                    await window.mealApiService.createMealEntry({
                        food_item_id: foodData.id,
                        meal_type: mealType,
                        servings: servings,
                        log_date: logDate
                    });
                    
                    alert('Meal added successfully!');
                    closePopup();
                    
                    if (window.location.hash === '#/' || window.location.hash === '#/home') {
                        window.location.reload();
                    }
                } else {
                    console.log(`Added ${foodData.name} - ${mealType} - ${servings} servings on ${logDate}`);
                    alert('Demo: Meal would be added to your log!');
                    closePopup();
                }
            } catch (error) {
                console.error('Error adding meal:', error);
                alert('Failed to add meal. Please try again.');
                addBtn.disabled = false;
                addBtn.textContent = 'Add';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, binding food card events');
    bindFoodCardEvents('food-container');
});

const sampleFoodData = [
    {
        id: "sample_1",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Chicken Wings",
        calories: 320,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "sample_2",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Rice with Egg",
        calories: 270,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "sample_3",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Noodles",
        calories: 280,
        serving_size: 1,
        serving_unit: "serving"
    }
];

const defaultMealsData = [
    {
        id: "default_1",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Chicken Wings",
        calories: 320,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_2",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Rice with Egg",
        calories: 270,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_3",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Chicken Soto",
        calories: 312,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_4",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Noodles",
        calories: 280,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_5",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Meatballs Soup",
        calories: 283,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_6",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Noodles Soup",
        calories: 137,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_7",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Taichan Satay",
        calories: 250,
        serving_size: 1,
        serving_unit: "serving"
    },
    {
        id: "default_8",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Pukis Cake",
        calories: 350,
        serving_size: 1,
        serving_unit: "serving"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFoodCard, renderFoodCards, bindFoodCardEvents, showAddMealPopup, showFoodDetailsPopup, sampleFoodData, defaultMealsData };
}

if (typeof window !== 'undefined') {
    window.FoodCard = { createFoodCard, renderFoodCards, bindFoodCardEvents, showAddMealPopup, showFoodDetailsPopup, sampleFoodData, defaultMealsData };
}
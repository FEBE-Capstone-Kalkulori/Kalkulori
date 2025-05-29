function createFoodCard(imageUrl, foodName, calories) {
    return `
        <div class="food-card">
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
        const cardHTML = createFoodCard(food.image, food.name, food.calories);
        container.innerHTML += cardHTML;
    });
    
    bindFoodCardEvents(containerId);
}

function bindFoodCardEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const newButtons = container.querySelectorAll('.add-button');
    newButtons.forEach(button => {
        button.addEventListener('click', function() {
            const foodCard = this.closest('.food-card');
            const foodName = foodCard.querySelector('.food-name').textContent;
            const foodCalories = foodCard.querySelector('.food-calories').textContent;
            console.log(`Added ${foodName} (${foodCalories}) to cart`);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    bindFoodCardEvents('food-container');
});

const sampleFoodData = [
    {
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Chicken Wings",
        calories: 320
    },
    {
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Rice with Egg",
        calories: 270
    },
    {
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Noodles",
        calories: 280
    }
];

const defaultMealsData = [
    {
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Chicken Wings",
        calories: 320
    },
    {
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Rice with Egg",
        calories: 270
    },
    {
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Chicken Soto",
        calories: 312
    },
    {
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Fried Noodles",
        calories: 280
    },
    {
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Meatballs Soup",
        calories: 283
    },
    {
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Noodles Soup",
        calories: 137
    },
    {
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Taichan Satay",
        calories: 250
    },
    {
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        name: "Pukis Cake",
        calories: 350
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFoodCard, renderFoodCards, bindFoodCardEvents, sampleFoodData, defaultMealsData };
}

if (typeof window !== 'undefined') {
    window.FoodCard = { createFoodCard, renderFoodCards, bindFoodCardEvents, sampleFoodData, defaultMealsData };
}
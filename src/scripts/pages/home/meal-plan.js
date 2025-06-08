export const formatMealPlanData = (planData) => {
  console.log('🔄 formatMealPlanData input:', JSON.stringify(planData, null, 2));
  
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const formattedPlans = [];

  mealTypes.forEach(mealType => {
    console.log(`🔍 Processing ${mealType}:`, planData[mealType]);
    
    if (planData[mealType]) {
      const meal = planData[mealType];
      const formattedMeal = {
        type: mealType.charAt(0).toUpperCase() + mealType.slice(1),
        name: meal.food_name || meal.name || 'Unknown Meal',
        image: meal.image_url || `./public/image/meals/${mealType}-default.jpg`,
        calories: Math.round(meal.calories_per_serving || meal.calories || 0),
        id: meal.id || null,
        serving_size: meal.serving_size || 1,
        serving_unit: meal.serving_unit || 'serving'
      };
      
      console.log(`✅ Formatted ${mealType}:`, formattedMeal);
      formattedPlans.push(formattedMeal);
    } else {
      console.log(`❌ Missing ${mealType} in plan data`);
    }
  });

  console.log('🔄 formatMealPlanData output:', formattedPlans);
  console.log('🔄 Total formatted meals:', formattedPlans.length);
  
  return formattedPlans;
};

export const calculateTotalCalories = (plans) => {
  return plans.reduce((total, plan) => total + (plan.calories || 0), 0);
};

export const getDefaultMealPlan = () => {
  return [
    {
      type: 'Breakfast',
      name: 'Fried Chicken Wings',
      image: './public/image/meals/fried-chicken-wings.jpg',
      calories: 400,
      id: 'default_breakfast',
      serving_size: 1,
      serving_unit: 'serving'
    },
    {
      type: 'Lunch',
      name: 'Fried Rice with Egg',
      image: './public/image/meals/fried-rice-egg.jpg',
      calories: 450,
      id: 'default_lunch',
      serving_size: 1,
      serving_unit: 'serving'
    },
    {
      type: 'Dinner',
      name: 'Soto Ayam',
      image: './public/image/meals/soto-ayam.jpg',
      calories: 350,
      id: 'default_dinner',
      serving_size: 1,
      serving_unit: 'serving'
    }
  ];
};

export const createMealPlanSection = (data) => {
  console.log('🎨 createMealPlanSection called with data:', {
    loading: data.loading,
    error: data.error,
    plansExists: !!data.plans,
    plansLength: data.plans?.length || 0,
    totalCalories: data.totalCalories,
    targetCalories: data.targetCalories
  });

  if (data.loading) {
    console.log('🎨 Rendering loading state');
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Generating personalized meal plan...</p>
      </div>
    `;
  }

  if (data.error) {
    console.log('🎨 Rendering error state:', data.error);
    const isProfileError = data.error.includes('profile') || data.error.includes('calorie target');
    const buttonText = isProfileError ? 'Complete Profile' : 'Try Again';
    const buttonAction = isProfileError ? 'complete-profile-btn' : 'generate-meal-plan-btn';
    
    return `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-message">${data.error}</p>
        <button class="retry-btn" id="${buttonAction}">${buttonText}</button>
      </div>
    `;
  }

  if (!data.plans || data.plans.length === 0) {
    console.log('🎨 Rendering no plans state - plans check:', {
      plansExists: !!data.plans,
      plansIsArray: Array.isArray(data.plans),
      plansLength: data.plans?.length || 0
    });
    
    return `
      <div class="error-container">
        <div class="error-icon">🍽️</div>
        <p class="error-message">No meal plans available</p>
        <button class="retry-btn" id="generate-meal-plan-btn">Generate Plan</button>
      </div>
    `;
  }

  console.log('🎨 Rendering meal plan content with', data.plans.length, 'plans');
  return `
    <div class="meal-plan-content">
      <div class="meal-plan-header">
        <div class="meal-plan-calories">
          <span class="current-calories">${data.totalCalories}</span>
          <span class="calories-separator">kcal/</span>
          <span class="target-calories">${data.targetCalories}</span>
        </div>
        <button class="generate-plan-btn" id="generate-meal-plan-btn">
          <span class="btn-icon">🔄</span>
          Generate New Plan
        </button>
      </div>
      
      <div class="meal-plan-grid">
        ${data.plans.map(plan => createMealPlanCard(plan)).join('')}
      </div>
    </div>
  `;
};

export const createMealPlanCard = (meal) => {
  return `
    <div class="meal-plan-card" data-meal-type="${meal.type.toLowerCase()}" data-meal-id="${meal.id || ''}">
      <div class="meal-plan-image">
        <img src="${meal.image}" alt="${meal.name}">
      </div>
      <div class="meal-plan-info">
        <div class="meal-type">${meal.type}</div>
        <div class="meal-name">${meal.name}</div>
        <div class="meal-calories">${meal.calories} kcal</div>
      </div>
      <button class="meal-plan-add-btn" data-meal='${JSON.stringify(meal)}'>
        <span class="plus-icon">+</span>
      </button>
    </div>
  `;
};

export const attachMealPlanEventHandlers = (onGenerateClicked, onMealItemClicked, onCompleteProfileClicked) => {
  const generateMealPlanButton = document.getElementById('generate-meal-plan-btn');
  const completeProfileButton = document.getElementById('complete-profile-btn');
  const mealPlanAddButtons = document.querySelectorAll('.meal-plan-add-btn');
  
  if (generateMealPlanButton && onGenerateClicked) {
    generateMealPlanButton.addEventListener('click', onGenerateClicked);
  }

  if (completeProfileButton && onCompleteProfileClicked) {
    completeProfileButton.addEventListener('click', onCompleteProfileClicked);
  }

  if (mealPlanAddButtons && onMealItemClicked) {
    mealPlanAddButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          const mealData = JSON.parse(button.dataset.meal);
          onMealItemClicked(mealData);
        } catch (error) {
          console.error('Error parsing meal data:', error);
        }
      });
    });
  }
};
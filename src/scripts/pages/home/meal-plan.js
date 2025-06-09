// Helper function for debugging format input
const _debugFormatInput = (input, label = 'FormatInput') => {
  console.log(`🔍 ${label} Analysis:`);
  console.log('==================================');
  
  if (!input) {
    console.log('❌ Input is null/undefined');
    return;
  }
  
  console.log('📋 Input type:', typeof input);
  console.log('📋 Input keys:', Object.keys(input));
  
  // Check if it's a meal plans array response
  if (input.meal_plans) {
    console.log('📋 Has meal_plans property');
    console.log('📋 meal_plans type:', typeof input.meal_plans);
    console.log('📋 meal_plans is array:', Array.isArray(input.meal_plans));
    if (Array.isArray(input.meal_plans)) {
      console.log('📋 meal_plans length:', input.meal_plans.length);
      if (input.meal_plans.length > 0) {
        console.log('📋 First plan keys:', Object.keys(input.meal_plans[0]));
        console.log('📋 First plan sample:', JSON.stringify(input.meal_plans[0], null, 4));
      }
    }
  }
  
  // Check if it's a direct meal plan object
  const mealTypeVariations = [
    'breakfast', 'lunch', 'dinner',
    'Breakfast', 'Lunch', 'Dinner',
    'BREAKFAST', 'LUNCH', 'DINNER'
  ];
  
  console.log('📋 Checking for meal types:');
  mealTypeVariations.forEach(type => {
    if (input[type]) {
      console.log(`  ✅ Found ${type}:`, Object.keys(input[type]));
      console.log(`  📄 ${type} data:`, JSON.stringify(input[type], null, 4));
    }
  });
  
  console.log('==================================');
};

export const formatMealPlanData = (input) => {
  console.log('🔄 formatMealPlanData input:', JSON.stringify(input, null, 2));
  
  // Debug input structure
  _debugFormatInput(input, 'formatMealPlanData Input');
  
  // Handle different input types
  let planData = null;
  
  // Case 1: Full API response with meal_plans array
  if (input && input.meal_plans && Array.isArray(input.meal_plans) && input.meal_plans.length > 0) {
    planData = input.meal_plans[0];
    console.log('📦 Using meal plan from API response (Case 1):', planData);
  }
  // Case 2: Direct meal plan object (individual plan from array)
  else if (input && (input.breakfast || input.lunch || input.dinner || 
                    input.Breakfast || input.Lunch || input.Dinner)) {
    planData = input;
    console.log('📦 Using direct meal plan object (Case 2):', planData);
  }
  // Case 3: No valid data
  else {
    console.log('❌ No valid meal plans found in input');
    console.log('❌ Input structure diagnosis:', {
      hasInput: !!input,
      inputType: typeof input,
      inputKeys: input ? Object.keys(input) : [],
      hasMealPlans: !!(input && input.meal_plans),
      isArray: Array.isArray(input && input.meal_plans),
      length: input && input.meal_plans ? input.meal_plans.length : 0,
      hasBreakfast: !!(input && (input.breakfast || input.Breakfast)),
      hasLunch: !!(input && (input.lunch || input.Lunch)),
      hasDinner: !!(input && (input.dinner || input.Dinner))
    });
    return [];
  }
  
  // Flexible meal type detection
  const possibleMealTypes = [
    { key: 'breakfast', display: 'Breakfast' },
    { key: 'lunch', display: 'Lunch' }, 
    { key: 'dinner', display: 'Dinner' }
  ];
  
  // Find all possible meal type variations in the plan data
  const availableMealKeys = Object.keys(planData);
  console.log('🔍 Available meal keys in plan data:', availableMealKeys);
  
  const formattedPlans = [];

  possibleMealTypes.forEach(({ key, display }) => {
    console.log(`🔍 Looking for ${key} variations...`);
    
    // Try different case variations
    const variations = [
      key,                                    // breakfast
      key.charAt(0).toUpperCase() + key.slice(1), // Breakfast
      key.toUpperCase()                       // BREAKFAST
    ];
    
    let mealData = null;
    let foundKey = null;
    
    // Find the meal data using any variation
    for (const variation of variations) {
      if (planData[variation]) {
        mealData = planData[variation];
        foundKey = variation;
        console.log(`✅ Found ${key} as "${foundKey}":`, mealData);
        break;
      }
    }
    
    if (mealData) {
      // Comprehensive field mapping for all possible backend formats
      const formattedMeal = {
        type: display,
        name: mealData.Name || mealData.food_name || mealData.name || `Unknown ${display}`,
        image: mealData.Image || mealData.image_url || `./public/image/meals/${key}-default.jpg`,
        calories: Math.round(mealData.Calories || mealData.calories_per_serving || mealData.calories || 0),
        id: mealData.RecipeId || mealData.id || mealData.recipe_id || `${key}_${Date.now()}`,
        serving_size: mealData.serving_size || mealData.ServingSize || 1,
        serving_unit: mealData.serving_unit || mealData.ServingUnit || 'serving',
        recipe_id: mealData.RecipeId || mealData.recipe_id || mealData.id || null,
        // Additional nutritional info if available
        protein: mealData.protein || mealData.ProteinContent || 0,
        carbs: mealData.carbs || mealData.CarbohydrateContent || 0,
        fat: mealData.fat || mealData.FatContent || 0
      };
      
      console.log(`✅ Formatted ${key}:`, formattedMeal);
      formattedPlans.push(formattedMeal);
    } else {
      console.log(`❌ Missing ${key} in plan data`);
      
      // Add default meal if missing (fallback)
      const defaultMeal = {
        type: display,
        name: `Default ${display}`,
        image: `./public/image/meals/${key}-default.jpg`,
        calories: 300,
        id: `default_${key}_${Date.now()}`,
        serving_size: 1,
        serving_unit: 'serving',
        recipe_id: null,
        protein: 15,
        carbs: 40,
        fat: 10
      };
      
      console.log(`🔧 Using default ${key}:`, defaultMeal);
      formattedPlans.push(defaultMeal);
    }
  });

  console.log('🔄 formatMealPlanData output:', formattedPlans);
  console.log('🔄 Total formatted meals:', formattedPlans.length);
  
  return formattedPlans;
};

export const calculateTotalCalories = (plans) => {
  const total = plans.reduce((total, plan) => total + (plan.calories || 0), 0);
  console.log('🧮 Total calories calculated:', total);
  return total;
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
    targetCalories: data.targetCalories,
    dataKeys: data ? Object.keys(data) : []
  });

  // Validate input data
  if (!data) {
    console.log('🎨 No data provided, rendering error state');
    return `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-message">No meal plan data available</p>
        <button class="retry-btn" id="generate-meal-plan-btn">Generate Plan</button>
      </div>
    `;
  }

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
    const isProfileError = data.error.includes('profile') || 
                          data.error.includes('calorie target') || 
                          data.error.includes('Profil') ||
                          data.error.includes('complete your profile') ||
                          data.error.includes('Profile setup required');
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

  // Validate plans data
  if (!data.plans || !Array.isArray(data.plans) || data.plans.length === 0) {
    console.log('🎨 Rendering no plans state - plans validation:', {
      plansExists: !!data.plans,
      plansIsArray: Array.isArray(data.plans),
      plansLength: data.plans?.length || 0,
      plansContent: data.plans
    });
    
    return `
      <div class="error-container">
        <div class="error-icon">🍽️</div>
        <p class="error-message">No meal plans available</p>
        <button class="retry-btn" id="generate-meal-plan-btn">Generate Plan</button>
      </div>
    `;
  }

  // Ensure we have valid calorie data
  const totalCalories = data.totalCalories || calculateTotalCalories(data.plans) || 0;
  const targetCalories = data.targetCalories || 1500;

  console.log('🎨 Rendering meal plan content with', data.plans.length, 'plans');
  console.log('🎨 Calorie info:', { totalCalories, targetCalories });
  
  return `
    <div class="meal-plan-content">
      <div class="meal-plan-header">
        <div class="meal-plan-calories">
          <span class="current-calories">${totalCalories}</span>
          <span class="calories-separator">kcal/</span>
          <span class="target-calories">${targetCalories}</span>
        </div>
        <button class="generate-plan-btn" id="generate-meal-plan-btn">
          <span class="btn-icon">🔄</span>
          Generate New Plan
        </button>
      </div>
      
      <div class="meal-plan-grid">
        ${data.plans.map(plan => createMealPlanCard(plan)).join('')}
      </div>
      
      ${data.plans.length < 3 ? `
        <div class="meal-plan-notice">
          <p>⚠️ Some meals may be using default options. Try generating a new plan.</p>
        </div>
      ` : ''}
    </div>
  `;
};

export const createMealPlanCard = (meal) => {
  // Validate meal data
  if (!meal) {
    console.warn('⚠️ No meal data provided to createMealPlanCard');
    return '';
  }

  // Extract data with fallbacks
  const mealType = meal.type || 'Meal';
  const mealName = meal.name || 'Unknown Meal';
  const mealCalories = meal.calories || 0;
  const mealImage = meal.image || './public/image/meals/default-meal.jpg';
  const mealId = meal.id || meal.recipe_id || `meal_${Date.now()}`;
  
  console.log('🃏 Creating meal card for:', { mealType, mealName, mealCalories, mealId });
  
  return `
    <div class="meal-plan-card" data-meal-type="${mealType.toLowerCase()}" data-meal-id="${mealId}">
      <div class="meal-plan-image">
        <img src="${mealImage}" alt="${mealName}" onerror="this.src='./public/image/meals/default-meal.jpg'; this.onerror=null;">
      </div>
      <div class="meal-plan-info">
        <div class="meal-type">${mealType}</div>
        <div class="meal-name" title="${mealName}">${mealName}</div>
        <div class="meal-calories">${mealCalories} kcal</div>
        ${meal.protein || meal.carbs || meal.fat ? `
          <div class="meal-nutrition-mini">
            ${meal.protein ? `P: ${Math.round(meal.protein)}g ` : ''}
            ${meal.carbs ? `C: ${Math.round(meal.carbs)}g ` : ''}
            ${meal.fat ? `F: ${Math.round(meal.fat)}g` : ''}
          </div>
        ` : ''}
      </div>
      <button class="meal-plan-add-btn" data-meal='${JSON.stringify({
        id: mealId,
        name: mealName,
        calories: mealCalories,
        serving_size: meal.serving_size || 1,
        serving_unit: meal.serving_unit || 'serving',
        type: mealType,
        image: mealImage,
        recipe_id: meal.recipe_id || meal.id
      })}' title="Add to diary">
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
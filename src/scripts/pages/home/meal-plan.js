import mealApiService from '../../utils/meal-api-service';

const _debugFormatInput = (input, label = 'FormatInput') => {
  console.log(`🔍 ${label} Analysis:`);
  console.log('==================================');
  
  if (!input) {
    console.log('❌ Input is null/undefined');
    return;
  }
  
  console.log('📋 Input type:', typeof input);
  console.log('📋 Input keys:', Object.keys(input));
  
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
  
  _debugFormatInput(input, 'formatMealPlanData Input');
  
  let planData = null;
  
  if (input && input.meal_plans && Array.isArray(input.meal_plans) && input.meal_plans.length > 0) {
    planData = input.meal_plans[0];
    console.log('📦 Using meal plan from API response (Case 1):', planData);
  }
  else if (input && (input.breakfast || input.lunch || input.dinner || 
                    input.Breakfast || input.Lunch || input.Dinner)) {
    planData = input;
    console.log('📦 Using direct meal plan object (Case 2):', planData);
  }
  else {
    console.log('❌ No valid meal plans found in input');
    return [];
  }
  
  const possibleMealTypes = [
    { key: 'breakfast', display: 'Breakfast' },
    { key: 'lunch', display: 'Lunch' }, 
    { key: 'dinner', display: 'Dinner' }
  ];
  
  const availableMealKeys = Object.keys(planData);
  console.log('🔍 Available meal keys in plan data:', availableMealKeys);
  
  const formattedPlans = [];

  possibleMealTypes.forEach(({ key, display }) => {
    console.log(`🔍 Looking for ${key} variations...`);
    
    const variations = [
      key,
      key.charAt(0).toUpperCase() + key.slice(1),
      key.toUpperCase()
    ];
    
    let mealData = null;
    let foundKey = null;
    
    for (const variation of variations) {
      if (planData[variation]) {
        mealData = planData[variation];
        foundKey = variation;
        console.log(`✅ Found ${key} as "${foundKey}":`, mealData);
        break;
      }
    }
    
    if (mealData) {
      const formattedMeal = {
        type: display,
        name: mealData.Name || mealData.food_name || mealData.name || `Unknown ${display}`,
        image: getFirstImageUrl(mealData.Image) || mealData.image_url || `./public/image/meals/${key}-default.jpg`,
        calories: Math.round(mealData.Calories || mealData.calories_per_serving || mealData.calories || 0),
        id: mealData.RecipeId || mealData.id || mealData.recipe_id || `${key}_${Date.now()}`,
        serving_size: mealData.serving_size || mealData.ServingSize || 1,
        serving_unit: mealData.serving_unit || mealData.ServingUnit || 'serving',
        recipe_id: mealData.RecipeId || mealData.recipe_id || mealData.id || null,
        protein: mealData.protein || mealData.ProteinContent || 0,
        carbs: mealData.carbs || mealData.CarbohydrateContent || 0,
        fat: mealData.fat || mealData.FatContent || 0
      };
      
      console.log(`✅ Formatted ${key}:`, formattedMeal);
      formattedPlans.push(formattedMeal);
    } else {
      console.log(`❌ Missing ${key} in plan data`);
      
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

const getFirstImageUrl = (inputString) => {
  if (!inputString || typeof inputString !== 'string') {
    return null;
  }
  
  const cleanInput = inputString.replace(/\\\//g, '/');
  const imageUrls = cleanInput.split(/,\s*(?=https?:\/\/)/);
  const firstUrl = imageUrls[0];
  
  if (firstUrl && firstUrl.trim()) {
    return firstUrl.trim().replace(/^"|"$/g, '');
  }
  
  return null;
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
        <div class="meal-plan-buttons">
          <button class="generate-plan-btn add-plan-btn" id="add-full-meal-plan-btn">
            <span class="btn-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></span>
            Add Plan
          </button>
          <button class="generate-plan-btn" id="generate-meal-plan-btn">
            <span class="btn-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z"/></svg></span>
            New Plan
          </button>
        </div>
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
  if (!meal) {
    console.warn('⚠️ No meal data provided to createMealPlanCard');
    return '';
  }

  const mealType = meal.type || 'Meal';
  const mealName = meal.name || 'Unknown Meal';
  const mealCalories = meal.calories || 0;
  const mealImage = meal.image || './public/image/meals/default-meal.jpg';
  const mealId = meal.id || meal.recipe_id || `meal_${Date.now()}`;
  
  console.log('🃏 Creating meal card for:', { mealType, mealName, mealCalories, mealId });
  
  return `
    <div class="meal-plan-card" data-meal-type="${mealType.toLowerCase()}" data-meal-id="${mealId}">
      <div class="meal-plan-image" data-meal-details-trigger>
        <img src="${mealImage}" alt="${mealName}" onerror="this.src='./public/image/meals/default-meal.jpg'; this.onerror=null;">
        <div class="image-overlay">
          <span class="view-details-text"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg> View Details</span>
        </div>
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

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const showMealPlanPopup = (mealData) => {
  const existingPopup = document.getElementById('meal-plan-popup-overlay');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  const popupHTML = `
    <div class="meal-popup-overlay" id="meal-plan-popup-overlay">
      <div class="meal-popup">
        <div class="meal-popup-header">
          <h3>Add ${mealData.name}</h3>
          <button class="popup-close" id="meal-plan-popup-close">&times;</button>
        </div>
        <div class="meal-popup-content">
          <div class="form-group">
            <label for="meal-plan-meal-type">Meal Type:</label>
            <select id="meal-plan-meal-type" required>
              <option value="">Select meal type</option>
              <option value="breakfast" ${mealData.type?.toLowerCase() === 'breakfast' ? 'selected' : ''}>Breakfast</option>
              <option value="lunch" ${mealData.type?.toLowerCase() === 'lunch' ? 'selected' : ''}>Lunch</option>
              <option value="dinner" ${mealData.type?.toLowerCase() === 'dinner' ? 'selected' : ''}>Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div class="form-group">
            <label for="meal-plan-servings">Servings:</label>
            <input type="number" id="meal-plan-servings" min="1" step="1" value="1" required>
          </div>
          <div class="form-group">
            <label for="meal-plan-log-date">Date:</label>
            <input type="date" id="meal-plan-log-date" value="${getTodayString()}" required>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" id="meal-plan-btn-cancel">Cancel</button>
            <button class="btn-add" id="meal-plan-btn-add">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', popupHTML);
  
  const overlay = document.getElementById('meal-plan-popup-overlay');
  const closeBtn = document.getElementById('meal-plan-popup-close');
  const cancelBtn = document.getElementById('meal-plan-btn-cancel');
  const addBtn = document.getElementById('meal-plan-btn-add');
  
  const closePopup = () => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (cancelBtn) cancelBtn.addEventListener('click', closePopup);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });
  }
  
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const mealType = document.getElementById('meal-plan-meal-type')?.value;
      const servings = parseFloat(document.getElementById('meal-plan-servings')?.value);
      const logDate = document.getElementById('meal-plan-log-date')?.value;
      
      if (!mealType || !servings || !logDate) {
        alert('Please fill all fields');
        return;
      }
      
      try {
        addBtn.disabled = true;
        addBtn.textContent = 'Adding...';
        
        if (mealData.recipe_id && !mealData.id?.toString().startsWith('default_')) {
          console.log('🍽️ Adding meal from plan:', {
            recipe_id: mealData.recipe_id,
            meal_type: mealType,
            servings: servings,
            log_date: logDate
          });
          
          await mealApiService.addMealFromPlan({
            recipe_id: mealData.recipe_id,
            meal_type: mealType,
            servings: servings,
            log_date: logDate
          });
        } else {
          console.log('🍽️ Adding default meal:', {
            food_item_id: mealData.id,
            meal_type: mealType,
            servings: servings,
            log_date: logDate
          });
          
          await mealApiService.createMealEntry({
            food_item_id: mealData.id,
            meal_type: mealType,
            servings: servings,
            log_date: logDate
          });
        }
        
        alert('Meal added successfully!');
        closePopup();
        
        const refreshEvent = new CustomEvent('mealPlanMealAdded');
        document.dispatchEvent(refreshEvent);
        
      } catch (error) {
        console.error('Error adding meal from plan:', error);
        alert(`Failed to add meal: ${error.message}`);
        addBtn.disabled = false;
        addBtn.textContent = 'Add';
      }
    });
  }
};

const addFullMealPlan = async (plans) => {
  try {
    const today = getTodayString();
    
    const mealPlanData = {
      meal_plan: {},
      log_date: today
    };
    
    plans.forEach(plan => {
      const mealType = plan.type.toLowerCase();
      if (['breakfast', 'lunch', 'dinner'].includes(mealType)) {
        mealPlanData.meal_plan[mealType] = {
          RecipeId: plan.recipe_id || plan.id,
          Name: plan.name,
          Calories: plan.calories,
          Image: plan.image
        };
      }
    });
    
    if (Object.keys(mealPlanData.meal_plan).length === 0) {
      throw new Error('No valid meals to add');
    }
    
    console.log('🍽️ Adding full meal plan:', mealPlanData);
    
    try {
      await mealApiService.addFullMealPlan(mealPlanData);
      alert('Full meal plan added successfully!');
    } catch (error) {
      console.warn('🔄 Full meal plan endpoint failed, trying individual meals:', error.message);
      
      if (error.message.includes('Endpoint not found') || error.message.includes('404') || error.message.includes('Network error')) {
        console.log('🔄 Falling back to individual meal additions...');
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          
          if (plan.recipe_id && !plan.id?.toString().startsWith('default_')) {
            try {
              await mealApiService.addMealFromPlan({
                recipe_id: plan.recipe_id,
                meal_type: plan.type.toLowerCase(),
                servings: 1,
                log_date: today
              });
              successCount++;
              console.log(`✅ Added ${plan.name} successfully`);
            } catch (individualError) {
              failCount++;
              console.error(`❌ Failed to add ${plan.name}:`, individualError);
            }
          } else {
            try {
              await mealApiService.createMealEntry({
                food_item_id: plan.id,
                meal_type: plan.type.toLowerCase(),
                servings: 1,
                log_date: today
              });
              successCount++;
              console.log(`✅ Added ${plan.name} (default) successfully`);
            } catch (individualError) {
              failCount++;
              console.error(`❌ Failed to add ${plan.name} (default):`, individualError);
            }
          }
          
          if (i < plans.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        if (successCount > 0) {
          alert(`Meal plan added successfully! ${successCount} meals added${failCount > 0 ? `, ${failCount} failed` : ''}.`);
        } else {
          throw new Error('Failed to add any meals from the plan');
        }
      } else {
        throw error;
      }
    }
    
    const refreshEvent = new CustomEvent('mealPlanMealAdded');
    document.dispatchEvent(refreshEvent);
    
  } catch (error) {
    console.error('Error adding full meal plan:', error);
    alert(`Failed to add meal plan: ${error.message}`);
  }
};

const showMealDetailsPopup = async (mealData) => {
  const existingPopup = document.getElementById('meal-details-popup-overlay');
  if (existingPopup) {
    existingPopup.remove();
  }

  let popupContent = '';
  
  if (!mealData.recipe_id || mealData.id?.toString().startsWith('default_')) {
    popupContent = `
      <div class="meal-details-content">
        <div class="meal-details-header">
          <img src="${mealData.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222'}" alt="${mealData.name}">
          <div class="meal-basic-info">
            <h3>${mealData.name}</h3>
            <p class="meal-calories">${mealData.calories} kcal per serving</p>
          </div>
        </div>
        
        <div class="meal-nutrition">
          <h4>Nutrition per serving:</h4>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="nutrition-label">Protein</span>
              <span class="nutrition-value">${Math.round(mealData.protein || 0)}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">Carbs</span>
              <span class="nutrition-value">${Math.round(mealData.carbs || 0)}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">Fat</span>
              <span class="nutrition-value">${Math.round(mealData.fat || 0)}g</span>
            </div>
          </div>
        </div>
        
        <div class="meal-info-note">
          <p>This is a default meal. Limited details available.</p>
        </div>
      </div>
    `;
  } else {
    popupContent = `
      <div class="meal-details-loading">
        <div class="loading-spinner"></div>
        <p>Loading meal details...</p>
      </div>
    `;
  }

  const popupHTML = `
    <div class="meal-details-popup-overlay" id="meal-details-popup-overlay">
      <div class="meal-details-popup">
        <div class="meal-details-popup-header">
          <h2>Meal Details</h2>
          <button class="popup-close" id="meal-details-close">&times;</button>
        </div>
        <div class="meal-details-popup-body">
          ${popupContent}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHTML);

  const overlay = document.getElementById('meal-details-popup-overlay');
  const closeBtn = document.getElementById('meal-details-close');

  const closePopup = () => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });
  }

  if (mealData.recipe_id && !mealData.id?.toString().startsWith('default_')) {
    try {
      const mealDetails = await mealApiService.getMealDetails(mealData.recipe_id);
      
      if (mealDetails && mealDetails.meal) {
        const meal = mealDetails.meal;
        const detailsContent = `
          <div class="meal-details-content">
            <div class="meal-details-header">
              <img src="${meal.image_url || mealData.image}" alt="${meal.food_name}">
              <div class="meal-basic-info">
                <h3>${meal.food_name}</h3>
                <p class="meal-calories">${meal.calories_per_serving} kcal per ${meal.serving_unit || 'serving'}</p>
                ${meal.recipe_metadata?.total_time ? `<p class="meal-time">⏱️ ${meal.recipe_metadata.total_time} minutes</p>` : ''}
              </div>
            </div>
            
            <div class="meal-nutrition">
              <h4>Nutrition per serving:</h4>
              <div class="nutrition-grid">
                <div class="nutrition-item">
                  <span class="nutrition-label">Protein</span>
                  <span class="nutrition-value">${Math.round(meal.protein_per_serving || 0)}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="nutrition-label">Carbs</span>
                  <span class="nutrition-value">${Math.round(meal.carbs_per_serving || 0)}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="nutrition-label">Fat</span>
                  <span class="nutrition-value">${Math.round(meal.fat_per_serving || 0)}g</span>
                </div>
              </div>
            </div>

            ${meal.recipe_metadata?.ingredients && meal.recipe_metadata.ingredients.length > 0 ? `
              <div class="meal-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                  ${meal.recipe_metadata.ingredients.slice(0, 10).map(ingredient => `<li>${ingredient}</li>`).join('')}
                  ${meal.recipe_metadata.ingredients.length > 10 ? `<li><em>... and ${meal.recipe_metadata.ingredients.length - 10} more ingredients</em></li>` : ''}
                </ul>
              </div>
            ` : ''}

            ${meal.recipe_metadata?.total_nutrition ? `
              <div class="detailed-nutrition">
                <h4>Detailed Nutrition:</h4>
                <div class="nutrition-details-grid">
                  ${meal.recipe_metadata.total_nutrition.fiber ? `<div>Fiber: ${Math.round(meal.recipe_metadata.total_nutrition.fiber)}g</div>` : ''}
                  ${meal.recipe_metadata.total_nutrition.sugar ? `<div>Sugar: ${Math.round(meal.recipe_metadata.total_nutrition.sugar)}g</div>` : ''}
                  ${meal.recipe_metadata.total_nutrition.sodium ? `<div>Sodium: ${Math.round(meal.recipe_metadata.total_nutrition.sodium)}mg</div>` : ''}
                  ${meal.recipe_metadata.total_nutrition.cholesterol ? `<div>Cholesterol: ${Math.round(meal.recipe_metadata.total_nutrition.cholesterol)}mg</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        `;

        const bodyElement = document.querySelector('.meal-details-popup-body');
        if (bodyElement) {
          bodyElement.innerHTML = detailsContent;
        }
      }
    } catch (error) {
      console.error('Error fetching meal details:', error);
      const bodyElement = document.querySelector('.meal-details-popup-body');
      if (bodyElement) {
        bodyElement.innerHTML = `
          <div class="meal-details-error">
            <h4>Error</h4>
            <p>Failed to load meal details. Please try again.</p>
            <div class="basic-meal-info">
              <img src="${mealData.image}" alt="${mealData.name}">
              <h3>${mealData.name}</h3>
              <p>${mealData.calories} kcal per serving</p>
            </div>
          </div>
        `;
      }
    }
  }
};

export const attachMealPlanEventHandlers = (onGenerateClicked, onMealItemClicked, onCompleteProfileClicked) => {
  const generateMealPlanButton = document.getElementById('generate-meal-plan-btn');
  const completeProfileButton = document.getElementById('complete-profile-btn');
  const addFullPlanButton = document.getElementById('add-full-meal-plan-btn');
  const mealPlanAddButtons = document.querySelectorAll('.meal-plan-add-btn');
  const mealPlanDetailsTriggers = document.querySelectorAll('[data-meal-details-trigger]');
  
  if (generateMealPlanButton && onGenerateClicked) {
    generateMealPlanButton.addEventListener('click', onGenerateClicked);
  }

  if (completeProfileButton && onCompleteProfileClicked) {
    completeProfileButton.addEventListener('click', onCompleteProfileClicked);
  }

  if (addFullPlanButton) {
    addFullPlanButton.addEventListener('click', async () => {
      const mealPlanCards = document.querySelectorAll('.meal-plan-card');
      const plans = [];
      
      mealPlanCards.forEach(card => {
        const addButton = card.querySelector('.meal-plan-add-btn');
        if (addButton && addButton.dataset.meal) {
          try {
            const mealData = JSON.parse(addButton.dataset.meal);
            plans.push(mealData);
          } catch (error) {
            console.error('Error parsing meal data:', error);
          }
        }
      });
      
      if (plans.length > 0) {
        addFullPlanButton.disabled = true;
        addFullPlanButton.textContent = 'Adding Plan...';
        
        try {
          await addFullMealPlan(plans);
        } catch (error) {
          console.error('Error adding full meal plan:', error);
        } finally {
          addFullPlanButton.disabled = false;
          addFullPlanButton.innerHTML = '<span class="btn-icon">📋</span> Add Plan';
        }
      } else {
        alert('No meals found to add');
      }
    });
  }

  if (mealPlanAddButtons) {
    mealPlanAddButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const mealData = JSON.parse(button.dataset.meal);
          showMealPlanPopup(mealData);
        } catch (error) {
          console.error('Error parsing meal data:', error);
        }
      });
    });
  }

  if (mealPlanDetailsTriggers) {
    mealPlanDetailsTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const mealCard = trigger.closest('.meal-plan-card');
        if (mealCard) {
          const addButton = mealCard.querySelector('.meal-plan-add-btn');
          if (addButton && addButton.dataset.meal) {
            try {
              const mealData = JSON.parse(addButton.dataset.meal);
              showMealDetailsPopup(mealData);
            } catch (error) {
              console.error('Error parsing meal data:', error);
            }
          }
        }
      });
    });
  }
};
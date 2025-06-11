function createFoodCard(
  imageUrl,
  foodName,
  calories,
  foodId = null,
  servingSize = null,
  servingUnit = null,
  isFromSearch = false,
  recipeId = null,
  protein = null,
  carbs = null,
  fat = null
) {
  return `
        <div class="relative w-full max-w-64 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 pb-12" 
             data-food-id="${foodId || ""}" 
             data-serving-size="${servingSize || 1}" 
             data-serving-unit="${servingUnit || "serving"}" 
             data-is-from-search="${isFromSearch || false}" 
             data-recipe-id="${recipeId || ""}" 
             data-protein="${protein || 0}" 
             data-carbs="${carbs || 0}" 
             data-fat="${fat || 0}">
            
            <!-- Food Image Container -->
            <div class="relative w-full h-44 overflow-hidden rounded-t-2xl">
                <img src="${imageUrl}" 
                     alt="${foodName}" 
                     class="w-full h-full object-cover">
                
                <!-- View Details Button (Info icon) -->
                <button class="absolute top-2 left-2 w-7 h-7 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-500 text-sm font-bold hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-md z-10 view-details-button">
                    <span class="details-icon text-xs leading-none">ⓘ</span>
                </button>
            </div>
            
            <!-- Food Info -->
            <div class="px-4 pt-3 pb-3 pr-16">
                <h3 class="text-lg font-semibold text-amber-900 mb-1 leading-tight food-name">${foodName}</h3>
                <p class="text-sm text-amber-700 font-normal food-calories">${
                  calories || 0
                } kcal</p>
            </div>
            
            <!-- Add Button -->
            <button class="absolute bottom-4 right-4 w-10 h-10 bg-amber-900 hover:bg-amber-800 active:bg-amber-950 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg add-button">
                <span class="text-white text-xl font-light leading-none plus-icon">+</span>
            </button>
        </div>
    `;
}

function renderFoodCards(foodData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  foodData.forEach((food) => {
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

  const newAddButtons = container.querySelectorAll(".add-button");
  newAddButtons.forEach((button) => {
    button.removeEventListener("click", handleAddButtonClick);
    button.addEventListener("click", handleAddButtonClick);
  });

  const newDetailsButtons = container.querySelectorAll(".view-details-button");
  newDetailsButtons.forEach((button) => {
    button.removeEventListener("click", handleDetailsButtonClick);
    button.addEventListener("click", handleDetailsButtonClick);
  });
}

function handleAddButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const foodCard = event.target.closest("[data-food-id]");
  if (!foodCard) return;

  const foodName =
    foodCard.querySelector(".food-name")?.textContent || "Unknown Food";
  const foodCaloriesText =
    foodCard.querySelector(".food-calories")?.textContent || "0 kcal";
  const foodCalories = parseInt(foodCaloriesText.replace(" kcal", "")) || 0;
  const foodId = foodCard.dataset.foodId || null;
  const servingSize = foodCard.dataset.servingSize || 1;
  const servingUnit = foodCard.dataset.servingUnit || "serving";
  const recipeId = foodCard.dataset.recipeId || null;
  const protein = parseFloat(foodCard.dataset.protein) || 0;
  const carbs = parseFloat(foodCard.dataset.carbs) || 0;
  const fat = parseFloat(foodCard.dataset.fat) || 0;
  const imageUrl = foodCard.querySelector("img")?.src || null;

  console.log("Add button clicked for:", {
    foodName,
    foodCalories,
    foodId,
    recipeId,
  });

  showAddMealPopup({
    id: foodId,
    recipe_id: recipeId,
    name: foodName,
    calories: foodCalories,
    serving_size: servingSize,
    serving_unit: servingUnit,
    protein: protein,
    carbs: carbs,
    fat: fat,
    image_url: imageUrl,
  });
}

function handleDetailsButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const foodCard = event.target.closest("[data-food-id]");
  if (!foodCard) return;

  const foodName =
    foodCard.querySelector(".food-name")?.textContent || "Unknown Food";
  const foodCaloriesText =
    foodCard.querySelector(".food-calories")?.textContent || "0 kcal";
  const foodCalories = parseInt(foodCaloriesText.replace(" kcal", "")) || 0;
  const foodId = foodCard.dataset.foodId || null;
  const recipeId = foodCard.dataset.recipeId || null;
  const isFromSearch = foodCard.dataset.isFromSearch === "true";
  const servingSize = parseFloat(foodCard.dataset.servingSize) || 1;
  const servingUnit = foodCard.dataset.servingUnit || "serving";
  const protein = parseFloat(foodCard.dataset.protein) || 0;
  const carbs = parseFloat(foodCard.dataset.carbs) || 0;
  const fat = parseFloat(foodCard.dataset.fat) || 0;

  console.log("Details button clicked for:", {
    foodName,
    foodId,
    recipeId,
    isFromSearch,
    protein,
    carbs,
    fat,
  });

  const fallbackData = {
    name: foodName,
    calories: foodCalories || 0,
    protein: protein || 0,
    carbs: carbs || 0,
    fat: fat || 0,
    serving_size: servingSize || 1,
    serving_unit: servingUnit || "serving",
    image_url: foodCard.querySelector("img")?.src || null,
  };

  if (
    recipeId &&
    recipeId !== "" &&
    recipeId !== "null" &&
    recipeId !== "undefined"
  ) {
    showFoodDetailsFromRecipe(recipeId, fallbackData);
  } else if (
    foodId &&
    foodId !== "" &&
    foodId !== "null" &&
    foodId !== "undefined" &&
    !isFromSearch
  ) {
    showFoodDetailsFromId(foodId);
  } else {
    showFoodDetailsPopup(fallbackData);
  }
}

async function showFoodDetailsFromRecipe(recipeId, fallbackData = null) {
  console.log("Trying to fetch recipe details for:", recipeId);
  console.log("Fallback data:", fallbackData);

  if (fallbackData && fallbackData.calories > 0) {
    console.log("Using fallback data directly for search result");
    showFoodDetailsPopup(fallbackData);
    return;
  }

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No auth token found, showing fallback data");
      if (fallbackData) {
        showFoodDetailsPopup(fallbackData);
      } else {
        alert("Authentication required to view details");
      }
      return;
    }

    showFoodDetailsPopup({ name: "Loading...", loading: true });

    const response = await fetch(
      `https://kalkulori.up.railway.app/api/meals/${recipeId}/details`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && result.data) {
      const mealData = result.data;
      showFoodDetailsPopup({
        name: mealData.food_name || mealData.Name || "Unknown Recipe",
        calories:
          mealData.calories_per_serving || Math.round(mealData.Calories) || 0,
        protein:
          mealData.protein_per_serving ||
          parseFloat(mealData.ProteinContent) ||
          0,
        carbs:
          mealData.carbs_per_serving ||
          parseFloat(mealData.CarbohydrateContent) ||
          0,
        fat: mealData.fat_per_serving || parseFloat(mealData.FatContent) || 0,
        serving_size: mealData.serving_size || mealData.ServingSize || 1,
        serving_unit: mealData.serving_unit || mealData.ServingUnit || "Porsi",
        image_url:
          mealData.image_url ||
          (mealData.Image
            ? mealData.Image.split(",")[0].trim().replace(/^"|"$/g, "")
            : null),
        description: mealData.description || mealData.Description,
        instructions: mealData.instructions || mealData.RecipeInstructions,
        ingredients: mealData.ingredients || mealData.RecipeIngredient,
      });
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
    if (fallbackData) {
      showFoodDetailsPopup(fallbackData);
    } else {
      showFoodDetailsPopup({
        name: "Error",
        error: "Failed to load food details. Please try again.",
        calories: 0,
      });
    }
  }
}

async function showFoodDetailsFromId(foodId) {
  try {
    const response = await fetch(
      `https://kalkulori.up.railway.app/api/foods/${foodId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && result.data && result.data.food) {
      const foodData = result.data.food;
      showFoodDetailsPopup({
        name: foodData.food_name,
        calories: foodData.calories_per_serving,
        protein: foodData.protein_per_serving,
        carbs: foodData.carbs_per_serving,
        fat: foodData.fat_per_serving,
        serving_size: foodData.serving_size,
        serving_unit: foodData.serving_unit,
        image_url: foodData.image_url,
      });
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching food details:", error);
    alert("Failed to load food details. Please try again.");
  }
}

function showFoodDetailsFromData(data) {
  showFoodDetailsPopup(data);
}

function showFoodDetailsPopup(foodData) {
  console.log("Showing details popup for:", foodData);

  const existingPopup = document.getElementById("food-details-popup-overlay");
  if (existingPopup) {
    existingPopup.remove();
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const imageUrl = foodData.image_url || defaultImage;

  const formatNutrient = (value) => {
    const num = parseFloat(value) || 0;
    return num.toFixed(1);
  };

  let contentHTML = "";

  if (foodData.loading) {
    contentHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
                <p class="text-gray-600">Loading food details...</p>
            </div>
        `;
  } else if (foodData.error) {
    contentHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h4 class="text-red-800 font-semibold mb-2">Error</h4>
                <p class="text-red-600">${foodData.error}</p>
            </div>
        `;
  } else {
    contentHTML = `
            <div class="w-full h-48 rounded-xl overflow-hidden mb-6">
                <img src="${imageUrl}" alt="${
      foodData.name
    }" class="w-full h-full object-cover" onerror="this.src='${defaultImage}'">
            </div>
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-3">Nutrition Information</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="font-medium text-gray-600">Calories:</span>
                            <span class="font-semibold text-blue-600">${
                              foodData.calories || 0
                            } kcal</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="font-medium text-gray-600">Protein:</span>
                            <span class="font-semibold text-blue-600">${formatNutrient(
                              foodData.protein
                            )}g</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="font-medium text-gray-600">Carbohydrates:</span>
                            <span class="font-semibold text-blue-600">${formatNutrient(
                              foodData.carbs
                            )}g</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span class="font-medium text-gray-600">Fat:</span>
                            <span class="font-semibold text-blue-600">${formatNutrient(
                              foodData.fat
                            )}g</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-3">Serving Information</h4>
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium text-gray-600">Serving Size:</span>
                        <span class="font-semibold text-blue-600">${
                          foodData.serving_size || 1
                        } ${foodData.serving_unit || "serving"}</span>
                    </div>
                </div>
                ${
                  foodData.description
                    ? `
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                        <p class="text-gray-600 leading-relaxed p-3 bg-gray-50 rounded-lg">${foodData.description}</p>
                    </div>
                `
                    : ""
                }
                ${
                  foodData.ingredients
                    ? `
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Ingredients</h4>
                        <p class="text-gray-600 leading-relaxed p-3 bg-gray-50 rounded-lg">${
                          Array.isArray(foodData.ingredients)
                            ? foodData.ingredients.join(", ")
                            : foodData.ingredients
                        }</p>
                    </div>
                `
                    : ""
                }
                ${
                  foodData.instructions
                    ? `
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Instructions</h4>
                        <p class="text-gray-600 leading-relaxed p-3 bg-gray-50 rounded-lg">${
                          Array.isArray(foodData.instructions)
                            ? foodData.instructions.join(" ")
                            : foodData.instructions
                        }</p>
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  const popupHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" id="food-details-popup-overlay">
            <div class="bg-white rounded-2xl max-w-lg w-11/12 max-h-95vh overflow-y-auto shadow-2xl transform transition-all duration-300">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-800">${
                      foodData.name || "Food Details"
                    }</h3>
                    <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600" id="details-popup-close">
                        <span class="text-2xl leading-none">&times;</span>
                    </button>
                </div>
                <div class="p-6">
                    ${contentHTML}
                </div>
                <div class="flex justify-center p-6 border-t border-gray-200">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200" id="btn-details-close">Close</button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", popupHTML);

  const overlay = document.getElementById("food-details-popup-overlay");
  const closeBtn = document.getElementById("details-popup-close");
  const closeBtnBottom = document.getElementById("btn-details-close");

  function closePopup() {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  if (closeBtnBottom) {
    closeBtnBottom.addEventListener("click", closePopup);
  }

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });
  }
}

function showAddMealPopup(foodData) {
  console.log("Showing popup for:", foodData);

  const existingPopup = document.getElementById("meal-popup-overlay");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popupHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" id="meal-popup-overlay">
            <div class="bg-white rounded-2xl max-w-md w-11/12 shadow-2xl transform transition-all duration-300">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-800">Add ${
                      foodData.name
                    }</h3>
                    <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600" id="popup-close">
                        <span class="text-2xl leading-none">&times;</span>
                    </button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label for="meal-type" class="block text-sm font-medium text-gray-700 mb-2">Meal Type:</label>
                        <select id="meal-type" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <option value="">Select meal type</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>
                    <div>
                        <label for="servings" class="block text-sm font-medium text-gray-700 mb-2">Servings:</label>
                        <input type="number" id="servings" min="1" step="1" value="1" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label for="log-date" class="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                        <input type="date" id="log-date" value="${
                          new Date().toISOString().split("T")[0]
                        }" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    </div>
                </div>
                <div class="flex gap-3 p-6 border-t border-gray-200">
                    <button class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200" id="btn-cancel">Cancel</button>
                    <button class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200" id="btn-add">Add</button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", popupHTML);

  const overlay = document.getElementById("meal-popup-overlay");
  const closeBtn = document.getElementById("popup-close");
  const cancelBtn = document.getElementById("btn-cancel");
  const addBtn = document.getElementById("btn-add");

  function closePopup() {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closePopup);
  }

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", async function () {
      const mealType = document.getElementById("meal-type")?.value;
      const servings = parseFloat(document.getElementById("servings")?.value);
      const logDate = document.getElementById("log-date")?.value;

      if (!mealType || !servings || !logDate) {
        alert("Please fill all fields");
        return;
      }

      try {
        addBtn.disabled = true;
        addBtn.textContent = "Adding...";

        if (window.mealApiService && foodData.id) {
          if (foodData.recipe_id) {
            await window.foodApiService.addFoodFromSearch({
              recipe_id: foodData.recipe_id,
              food_name: foodData.name,
              calories_per_serving: foodData.calories || 0,
              protein_per_serving: foodData.protein || 0,
              carbs_per_serving: foodData.carbs || 0,
              fat_per_serving: foodData.fat || 0,
              serving_size: foodData.serving_size || 1,
              serving_unit: foodData.serving_unit || "serving",
              meal_type: mealType,
              servings: servings,
              log_date: logDate,
              image_url: foodData.image_url,
            });
          } else {
            await window.mealApiService.createMealEntry({
              food_item_id: foodData.id,
              meal_type: mealType,
              servings: servings,
              log_date: logDate,
            });
          }

          alert("Meal added successfully!");
          closePopup();

          const event = new CustomEvent("mealAdded", {
            detail: { source: "search", mealData: foodData },
          });
          document.dispatchEvent(event);

          if (
            window.location.hash === "#/" ||
            window.location.hash === "#/home"
          ) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } else {
          console.log(
            `Added ${foodData.name} - ${mealType} - ${servings} servings on ${logDate}`
          );
          alert("Demo: Meal would be added to your log!");
          closePopup();
        }
      } catch (error) {
        console.error("Error adding meal:", error);
        alert("Failed to add meal. Please try again.");
        addBtn.disabled = false;
        addBtn.textContent = "Add";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, binding food card events");
  bindFoodCardEvents("food-container");
});

const sampleFoodData = [
  {
    id: "sample_1",
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Chicken Wings",
    calories: 320,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "sample_2",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Rice with Egg",
    calories: 270,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "sample_3",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Noodles",
    calories: 280,
    serving_size: 1,
    serving_unit: "serving",
  },
];

const defaultMealsData = [
  {
    id: "default_1",
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Chicken Wings",
    calories: 320,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_2",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Rice with Egg",
    calories: 270,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_3",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Chicken Soto",
    calories: 312,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_4",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Fried Noodles",
    calories: 280,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_5",
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Meatballs Soup",
    calories: 283,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_6",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Noodles Soup",
    calories: 137,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_7",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Taichan Satay",
    calories: 250,
    serving_size: 1,
    serving_unit: "serving",
  },
  {
    id: "default_8",
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    name: "Pukis Cake",
    calories: 350,
    serving_size: 1,
    serving_unit: "serving",
  },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createFoodCard,
    renderFoodCards,
    bindFoodCardEvents,
    showAddMealPopup,
    showFoodDetailsPopup,
    sampleFoodData,
    defaultMealsData,
  };
}

if (typeof window !== "undefined") {
  window.FoodCard = {
    createFoodCard,
    renderFoodCards,
    bindFoodCardEvents,
    showAddMealPopup,
    showFoodDetailsPopup,
    sampleFoodData,
    defaultMealsData,
  };
}

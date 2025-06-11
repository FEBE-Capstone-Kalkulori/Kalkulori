const createAddMealTemplate = (data) => {
  return `
    <div class="fixed inset-0 bg-yellow-50 z-50 overflow-y-auto">
      <!-- Header -->
      <div class="px-4 py-4 sm:px-6 sm:py-4 flex items-center border-b-2 border-dotted border-white relative w-full" style="background-color: #9BCF53;">
        <button class="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 p-2 -ml-2" id="back-button">
          <span class="text-2xl font-bold leading-none">‹</span>
          <span class="text-base font-medium">Back</span>
        </button>
        <h1 class="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-semibold text-gray-800 m-0">
          ${data.isSearchMode ? "Search Results" : "Search Meal"}
        </h1>
      </div>
      
      <!-- Search Section -->
      <div class="bg-yellow-50 px-4 py-5 sm:px-6 sm:py-6 flex justify-center">
        <div class="w-full max-w-4xl">
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input 
              type="text" 
              class="flex-1 px-4 py-3 sm:px-5 sm:py-4 border-2 border-dashed border-gray-600 rounded-lg text-base bg-white outline-none text-gray-600 placeholder-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:border-green-500"
              id="search-input"
              placeholder="What food that you ate?"
              value="${data.searchQuery}"
              ${data.loading ? "disabled" : ""}
            />
            <button class="bg-amber-900 hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base font-semibold transition-colors duration-200 whitespace-nowrap" 
                    id="search-button" 
                    ${data.loading ? "disabled" : ""}>
              ${data.loading ? "Searching..." : "Search"}
            </button>
            ${
              data.isSearchMode && data.searchQuery
                ? `
              <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg text-base font-semibold transition-colors duration-200 whitespace-nowrap" id="clear-search-button">
                Clear Search
              </button>
            `
                : ""
            }
          </div>
          ${data.isSearchMode ? createSearchInfo(data) : ""}
        </div>
      </div>
      
      <!-- Content Section -->
      ${createContentSection(data)}
      
      <!-- Pagination Section -->
      ${createPaginationSection(data)}
    </div>
  `;
};

const createSearchInfo = (data) => {
  return "";
};

const createContentSection = (data) => {
  if (data.loading) {
    return `
      <div class="flex flex-col items-center justify-center py-12 px-4">
        <div class="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 text-center text-base">${
          data.isSearchMode ? "Searching foods..." : "Loading foods..."
        }</p>
      </div>
    `;
  }

  if (data.error) {
    return `
      <div class="px-4 py-6">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p class="text-red-800 font-medium text-base">${data.error}</p>
        </div>
        ${data.meals.length > 0 ? createMealsContainer(data.meals) : ""}
      </div>
    `;
  }

  if (data.meals.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p class="text-gray-600 text-lg mb-6 max-w-md">
          ${
            data.searchQuery
              ? `No foods found for "${data.searchQuery}"`
              : "No foods available"
          }
        </p>
        ${
          data.isSearchMode
            ? `
            <button class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200" id="browse-all-button">
              Browse All Foods
            </button>
          `
            : ""
        }
      </div>
    `;
  }

  return createMealsContainer(data.meals);
};

const createMealsContainer = (meals) => {
  return `
    <div class="px-4 py-4" id="food-container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 justify-items-center max-w-6xl mx-auto">
        ${createMealsGrid(meals)}
      </div>
    </div>
  `;
};

const createMealsGrid = (meals) => {
  return meals
    .map((meal) =>
      window.FoodCard.createFoodCard(
        meal.image,
        meal.name,
        meal.calories,
        meal.id,
        meal.serving_size,
        meal.serving_unit,
        meal.is_from_search || false,
        meal.recipe_id,
        meal.protein,
        meal.carbs,
        meal.fat
      )
    )
    .join("");
};

const createPaginationSection = (data) => {
  if (data.loading || data.meals.length === 0 || data.isSearchMode) {
    return "";
  }

  const hasPages =
    data.pagination.has_next_page || data.pagination.has_prev_page;

  if (!hasPages) {
    return "";
  }

  return `
    <div class="flex justify-center items-center py-6 px-4 gap-4 sm:gap-6 bg-yellow-50 border-t border-gray-200">
      <button 
        class="bg-amber-900 hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 min-w-20" 
        id="prev-button"
        ${!data.pagination.has_prev_page ? "disabled" : ""}
      >
        Previous
      </button>
      
      <span class="text-sm sm:text-base font-semibold text-gray-800 px-2 whitespace-nowrap">
        Page ${data.currentPage + 1}
      </span>
      
      <button 
        class="bg-amber-900 hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 min-w-16" 
        id="next-button"
        ${!data.pagination.has_next_page ? "disabled" : ""}
      >
        Next
      </button>
    </div>
  `;
};

const bindEventListeners = (eventHandlers) => {
  const backButton = document.getElementById("back-button");
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const clearSearchButton = document.getElementById("clear-search-button");
  const browseAllButton = document.getElementById("browse-all-button");
  const foodContainer = document.getElementById("food-container");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  if (backButton && eventHandlers.onBackClicked) {
    backButton.addEventListener("click", eventHandlers.onBackClicked);
  }

  if (searchButton && eventHandlers.onSearchClicked) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        eventHandlers.onSearchClicked(query);
      }
    });
  }

  if (searchInput && eventHandlers.onSearchClicked) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          eventHandlers.onSearchClicked(query);
        }
      }
    });

    searchInput.focus();
  }

  if (clearSearchButton && eventHandlers.onClearSearchClicked) {
    clearSearchButton.addEventListener(
      "click",
      eventHandlers.onClearSearchClicked
    );
  }

  if (browseAllButton && eventHandlers.onClearSearchClicked) {
    browseAllButton.addEventListener(
      "click",
      eventHandlers.onClearSearchClicked
    );
  }

  if (prevButton && eventHandlers.onPreviousClicked) {
    prevButton.addEventListener("click", eventHandlers.onPreviousClicked);
  }

  if (nextButton && eventHandlers.onNextClicked) {
    nextButton.addEventListener("click", eventHandlers.onNextClicked);
  }

  if (foodContainer) {
    window.FoodCard.bindFoodCardEvents("food-container");
  }
};

export default {
  render(container, data, eventHandlers) {
    if (!container) {
      console.error("Container not found for add meal view");
      return;
    }

    container.innerHTML = createAddMealTemplate(data);
    bindEventListeners(eventHandlers);
  },
};

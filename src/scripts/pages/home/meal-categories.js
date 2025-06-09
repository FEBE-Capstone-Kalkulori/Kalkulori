export const MEAL_CATEGORIES = {
  'dietary': {
    title: 'Dietary Preferences',
    icon: '🥗',
    keywords: [
      'vegetarian', 'vegan', 'dairy free foods', 'egg free', 'lactose free',
      'no shell fish', 'low calorie', 'healthy', 'light', 'low cholesterol', 
      'low protein', 'very low carbs', 'high fiber', 'high protein', 'protein'
    ]
  },
  'cooking': {
    title: 'Cooking Style',
    icon: '👨‍🍳',
    keywords: [
      'no cook', 'stove top', 'oven', 'baking', 'broil/grill', 'microwave',
      'pressure cooker', 'deep fried', 'steam', 'stir fry', 'wok',
      'small appliance', 'mixer', 'dehydrator', 'bread machine'
    ]
  },
  'mealtime': {
    title: 'Meal Type & Time',
    icon: '⏰',
    keywords: [
      'breakfast', 'brunch', 'lunch', 'dinner', 'snacks', 'dessert',
      'one dish meal', 'stew', 'soup', 'pasta', 'bread', 'beverages',
      '< 15 mins', '< 30 mins', '< 60 mins', 'weeknight', 'inexpensive'
    ]
  },
  'ingredients': {
    title: 'Main Ingredients',
    icon: '🥘',
    keywords: [
      'chicken', 'beef', 'pork', 'fish', 'seafood', 'vegetable', 'soy/tofu',
      'rice', 'pasta', 'beans', 'cheese', 'nuts', 'fruits', 'berries',
      'mushroom', 'peppers', 'onions', 'spinach', 'corn'
    ]
  },
  'cuisine': {
    title: 'Cuisine & Flavors',
    icon: '🌍',
    keywords: [
      'chinese', 'japanese', 'thai', 'vietnamese', 'korean', 'indian',
      'italian', 'french', 'mexican', 'spanish', 'mediterranean',
      'spicy', 'sweet', 'savory', 'umami', 'tangy', 'sour', 'mild'
    ]
  }
};

// Helper function to get all keywords from all categories
export const getAllKeywords = () => {
  return Object.values(MEAL_CATEGORIES).reduce((allKeywords, category) => {
    return [...allKeywords, ...category.keywords];
  }, []);
};

// Helper function to find which category a keyword belongs to
export const findCategoryByKeyword = (keyword) => {
  for (const [categoryKey, category] of Object.entries(MEAL_CATEGORIES)) {
    if (category.keywords.includes(keyword)) {
      return {
        key: categoryKey,
        ...category
      };
    }
  }
  return null;
};

// Helper function to get keywords by category
export const getKeywordsByCategory = (categoryKey) => {
  return MEAL_CATEGORIES[categoryKey]?.keywords || [];
};

// Helper function to get category info
export const getCategoryInfo = (categoryKey) => {
  return MEAL_CATEGORIES[categoryKey] || null;
};

// Helper function to count selected keywords per category
export const countSelectedKeywordsByCategory = (selectedKeywords) => {
  const counts = {};
  
  Object.keys(MEAL_CATEGORIES).forEach(categoryKey => {
    const categoryKeywords = MEAL_CATEGORIES[categoryKey].keywords;
    counts[categoryKey] = selectedKeywords.filter(keyword => 
      categoryKeywords.includes(keyword)
    ).length;
  });
  
  return counts;
};

// Helper function to validate keywords
export const validateKeywords = (keywords) => {
  const allKeywords = getAllKeywords();
  return keywords.filter(keyword => allKeywords.includes(keyword));
};

// Helper function to get random keywords for suggestions
export const getRandomKeywords = (count = 5, excludeKeywords = []) => {
  const allKeywords = getAllKeywords().filter(keyword => 
    !excludeKeywords.includes(keyword)
  );
  
  const shuffled = allKeywords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to group keywords by category
export const groupKeywordsByCategory = (keywords) => {
  const grouped = {};
  
  keywords.forEach(keyword => {
    const category = findCategoryByKeyword(keyword);
    if (category) {
      if (!grouped[category.key]) {
        grouped[category.key] = {
          title: category.title,
          icon: category.icon,
          keywords: []
        };
      }
      grouped[category.key].keywords.push(keyword);
    }
  });
  
  return grouped;
};

export default {
  MEAL_CATEGORIES,
  getAllKeywords,
  findCategoryByKeyword,
  getKeywordsByCategory,
  getCategoryInfo,
  countSelectedKeywordsByCategory,
  validateKeywords,
  getRandomKeywords,
  groupKeywordsByCategory
};
let sliderState = {
  slideIndex: 0,
  autoSlideInterval: null,
  isInitialized: false,
  eventListeners: [],
  initTimeout: null
};

const isValidHomePage = () => {
  const currentHash = window.location.hash.slice(1);
  return currentHash === '/home' || currentHash === '/' || currentHash === '';
};

const initSlider = () => {
  if (sliderState.initTimeout) {
    clearTimeout(sliderState.initTimeout);
    sliderState.initTimeout = null;
  }

  if (!isValidHomePage()) {
    console.log('Not on home page, skipping slider initialization');
    return;
  }

  cleanupSlider();

  const sliderElement = document.querySelector('.slider');
  if (!sliderElement) {
    console.warn('Slider element not found. Make sure you have an element with class "slider"');
    return;
  }
  
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (slides.length === 0) {
    console.warn('No slides found. Make sure you have elements with class "slide"');
    return;
  }

  sliderState.slideIndex = 0;
  sliderState.isInitialized = true;
  sliderState.eventListeners = [];

  function showSlides() {
    if (!isValidHomePage() || !sliderState.isInitialized) {
      cleanupSlider();
      return;
    }

    sliderState.slideIndex++;
    if (sliderState.slideIndex >= slides.length) {
      sliderState.slideIndex = 0;
    }

    const currentSliderElement = document.querySelector('.slider');
    if (currentSliderElement && isValidHomePage()) {
      currentSliderElement.style.transform = `translateX(-${sliderState.slideIndex * 100}%)`;
    }

    const currentDots = document.querySelectorAll('.dot');
    currentDots.forEach((dot, index) => {
      if (dot && isValidHomePage()) {
        if (index === sliderState.slideIndex) {
          dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.remove('bg-primary-text', 'opacity-50');
        } else {
          dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.add('bg-primary-text', 'opacity-50');
        }
      }
    });

    if (isValidHomePage() && sliderState.isInitialized) {
      sliderState.autoSlideInterval = setTimeout(showSlides, 5000);
    }
  }

  function currentSlide(n) {
    if (!isValidHomePage() || !sliderState.isInitialized) {
      return;
    }

    if (sliderState.autoSlideInterval) {
      clearTimeout(sliderState.autoSlideInterval);
      sliderState.autoSlideInterval = null;
    }

    sliderState.slideIndex = n;

    const currentSliderElement = document.querySelector('.slider');
    if (currentSliderElement) {
      currentSliderElement.style.transform = `translateX(-${sliderState.slideIndex * 100}%)`;
    }

    const currentDots = document.querySelectorAll('.dot');
    currentDots.forEach((dot, index) => {
      if (dot) {
        if (index === sliderState.slideIndex) {
          dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.remove('bg-primary-text', 'opacity-50');
        } else {
          dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.add('bg-primary-text', 'opacity-50');
        }
      }
    });

    if (isValidHomePage() && sliderState.isInitialized) {
      sliderState.autoSlideInterval = setTimeout(showSlides, 5000);
    }
  }

  dots.forEach((dot, index) => {
    if (dot) {
      const clickHandler = () => {
        if (isValidHomePage() && sliderState.isInitialized) {
          currentSlide(index);
        }
      };
      
      dot.addEventListener('click', clickHandler);
      sliderState.eventListeners.push({ element: dot, event: 'click', handler: clickHandler });
    }
  });

  dots.forEach((dot, index) => {
    if (dot) {
      if (index === sliderState.slideIndex) {
        dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
        dot.classList.remove('bg-primary-text', 'opacity-50');
      } else {
        dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
        dot.classList.add('bg-primary-text', 'opacity-50');
      }
    }
  });

  if (isValidHomePage()) {
    sliderState.autoSlideInterval = setTimeout(showSlides, 5000);
  }

  console.log('Slider initialized successfully on home page');
};

const cleanupSlider = () => {
  if (sliderState.initTimeout) {
    clearTimeout(sliderState.initTimeout);
    sliderState.initTimeout = null;
  }

  if (sliderState.autoSlideInterval) {
    clearTimeout(sliderState.autoSlideInterval);
    sliderState.autoSlideInterval = null;
  }

  sliderState.eventListeners.forEach(({ element, event, handler }) => {
    if (element && handler) {
      element.removeEventListener(event, handler);
    }
  });

  sliderState.eventListeners = [];
  sliderState.isInitialized = false;
  sliderState.slideIndex = 0;

  console.log('Slider cleanup completed');
};

const safeInitSlider = () => {
  cleanupSlider();

  if (!isValidHomePage()) {
    console.log('Not on home page, skipping slider initialization');
    return;
  }

  sliderState.initTimeout = setTimeout(() => {
    if (isValidHomePage()) {
      initSlider();
    }
  }, 200);
};

const SliderComponent = {
  init: safeInitSlider,
  cleanup: cleanupSlider,
  isInitialized: () => sliderState.isInitialized,
  forceCleanup: () => {
    cleanupSlider();
  }
};

export default SliderComponent;
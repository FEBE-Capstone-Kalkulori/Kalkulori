const initSlider = () => {
  const currentHash = window.location.hash.slice(1);
  const isHomePage = currentHash === '/home' || currentHash === '/' || currentHash === '';
  
  if (!isHomePage) {
    return;
  }

  let slideIndex = 0;
  let autoSlideInterval = null;

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

  function showSlides() {
    slideIndex++;
    if (slideIndex >= slides.length) {
      slideIndex = 0;
    }

    if (sliderElement) {
      sliderElement.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    dots.forEach((dot, index) => {
      if (dot) {
        if (index === slideIndex) {
          dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.remove('bg-primary-text', 'opacity-50');
        } else {
          dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.add('bg-primary-text', 'opacity-50');
        }
      }
    });    
  }

  function currentSlide(n) {
    if (autoSlideInterval) {
      clearTimeout(autoSlideInterval);
    }

    slideIndex = n;

    if (sliderElement) {
      sliderElement.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    dots.forEach((dot, index) => {
      if (dot) {
        if (index === slideIndex) {
          dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.remove('bg-primary-text', 'opacity-50');
        } else {
          dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
          dot.classList.add('bg-primary-text', 'opacity-50');
        }
      }
    });

    autoSlideInterval = setTimeout(showSlides, 5000);
  }

  autoSlideInterval = setTimeout(showSlides, 5000);

  dots.forEach((dot, index) => {
    if (dot) {
      dot.addEventListener('click', () => {
        currentSlide(index);
      });
    }
  });

  dots.forEach((dot, index) => {
    if (dot) {
      if (index === slideIndex) {
        dot.classList.add('bg-accent-green', 'scale-125', 'shadow-lg');
        dot.classList.remove('bg-primary-text', 'opacity-50');
      } else {
        dot.classList.remove('bg-accent-green', 'scale-125', 'shadow-lg');
        dot.classList.add('bg-primary-text', 'opacity-50');
      }
    }
  });

  const cleanup = () => {
    if (autoSlideInterval) {
      clearTimeout(autoSlideInterval);
      autoSlideInterval = null;
    }
  };

  window.sliderCleanup = cleanup;
};

const cleanupSlider = () => {
  if (window.sliderCleanup) {
    window.sliderCleanup();
    window.sliderCleanup = null;
  }
};

const safeInitSlider = () => {
  cleanupSlider();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
};

const SliderComponent = {
  init: safeInitSlider,
  cleanup: cleanupSlider
};

export default SliderComponent;
const initSlider = () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  function showSlides() {
    slideIndex++;
    if (slideIndex >= slides.length) {
      slideIndex = 0;
    }
    document.querySelector('.slider').style.transform = `translateX(-${slideIndex * 100}%)`;
    
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('bg-accent-green');
        dot.classList.remove('bg-primary-text');
      } else {
        dot.classList.remove('bg-accent-green');
        dot.classList.add('bg-primary-text');
      }
    });
    
    setTimeout(showSlides, 5000);
  }

  function currentSlide(n) {
    slideIndex = n;
    document.querySelector('.slider').style.transform = `translateX(-${slideIndex * 100}%)`;
    
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('bg-accent-green');
        dot.classList.remove('bg-primary-text');
      } else {
        dot.classList.remove('bg-accent-green');
        dot.classList.add('bg-primary-text');
      }
    });
  }

  setTimeout(showSlides, 5000);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide(index);
    });
  });
};

export default initSlider;
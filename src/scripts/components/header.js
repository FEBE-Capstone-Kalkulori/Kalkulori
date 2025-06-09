class Header {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.slideInterval = null;
  }

  // Header untuk halaman Sign In dan Sign Up (tanpa navigasi)
  renderAuthHeader() {
    return `
            <header class="relative font-cal-sans tracking-wider bg-primary-bg">
                <div class="flex justify-center items-center px-8 py-4 h-20">
                    <div class="flex items-center">
                        <img src="./public/image/logo-text.png" alt="Kalkulori Logo" class="h-auto w-60">
                    </div>
                </div>
            </header>
        `;
  }

  // Header untuk halaman Home (dengan slider dan navigasi transparan)
  renderHomeHeader() {
    return `
            <header class="relative font-cal-sans tracking-wider">
                <!-- Navigation Bar - Transparan di atas slider -->
                <div class="absolute top-0 left-0 w-full z-30 flex justify-between items-center px-8 py-2 bg-transparent h-20">
                    <div class="flex items-center">
                        <img src="./public/image/logo-text.png" alt="Kalkulori Logo" class="h-auto w-60 mr-1">
                    </div>
                    <nav class="flex gap-6">
                        <a href="#/" class="text-primary-text/70 no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline">Home</a>
                        <a href="#/history" class="text-primary-text/70 no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline">History</a>
                        <a href="#/profile" class="text-primary-text/70 no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline">Profile</a>
                    </nav>
                </div>

                <!-- Slider Section -->
                <div class="w-full overflow-hidden relative h-screen max-h-[600px]">
                    <div id="slider" class="flex transition-transform duration-500 ease-in-out h-full">
                        <!-- Slide 1 - Welcome -->
                        <div class="min-w-full h-full bg-cover bg-center flex relative flex-col justify-center items-center text-primary-text text-center p-4 slide-2">
                            <div class="absolute top-0 left-0 w-full h-full z-10 slide-overlay"></div>
                            <h2 class="relative z-20 text-4xl font-bold mb-4 max-w-4/5" style="text-shadow: 2px 2px 4px rgba(184, 147, 0, 0.7);">Welcome to Kalkulori!</h2>
                            <p class="relative z-20 text-2xl font-medium max-w-3/5" style="text-shadow: 1px 1px 2px rgba(255, 174, 0, 0.7);">Ready to live a healthy life?</p>
                        </div>

                        <!-- Slide 2 - Count Calories -->
                        <div class="min-w-full h-full bg-cover bg-center flex relative flex-col justify-center items-center text-primary-text text-center p-4 slide-1">
                            <div class="absolute top-0 left-0 w-full h-full z-10 slide-overlay"></div>
                            <h2 class="relative z-20 text-4xl font-bold mb-4 max-w-4/5" style="text-shadow: 2px 2px 4px rgba(184, 147, 0, 0.7);">Count your calories easily everyday</h2>
                            <p class="relative z-20 text-2xl font-medium max-w-3/5" style="text-shadow: 1px 1px 2px rgba(255, 174, 0, 0.7);">Maintain a healthy eating habit with Kalkulori</p>
                        </div>

                        <!-- Slide 3 - Track Progress -->
                        <div class="min-w-full h-full bg-cover bg-center flex relative flex-col justify-center items-center text-primary-text text-center p-4 slide-3">
                            <div class="absolute top-0 left-0 w-full h-full z-10 slide-overlay"></div>
                            <h2 class="relative z-20 text-4xl font-bold mb-4 max-w-4/5" style="text-shadow: 2px 2px 4px rgba(184, 147, 0, 0.7);">Track your progress</h2>
                            <p class="relative z-20 text-2xl font-medium max-w-3/5" style="text-shadow: 1px 1px 2px rgba(255, 174, 0, 0.7);">view charts and statistics of your eating habits over a selected period of time</p>
                        </div>
                    </div>

                    <!-- Slider Navigation Dots -->
                    <div class="flex justify-center absolute bottom-5 w-full z-20">
                        <span class="dot w-3 h-3 bg-primary-text/70 rounded-full mx-1 cursor-pointer transition-all duration-300 hover:bg-primary-text" data-slide="0"></span>
                        <span class="dot w-3 h-3 bg-primary-text/70 rounded-full mx-1 cursor-pointer transition-all duration-300 hover:bg-primary-text" data-slide="1"></span>
                        <span class="dot w-3 h-3 bg-primary-text/70 rounded-full mx-1 cursor-pointer transition-all duration-300 hover:bg-primary-text" data-slide="2"></span>
                    </div>
                </div>
            </header>
        `;
  }

  // Header untuk halaman Profile dan History (solid background dengan navigasi)
  renderPageHeader(currentPage) {
    return `
            <header class="relative font-cal-sans tracking-wider bg-accent-yellow">
                <div class="flex justify-between items-center px-8 py-2 h-20">
                    <div class="flex items-center">
                        <img src="./public/image/logo-text.png" alt="Kalkulori Logo" class="h-auto w-60 mr-1">
                    </div>
                    <nav class="flex gap-6">
                        <a href="#/" class="no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline ${
                          currentPage === "home"
                            ? "text-primary-text font-semibold"
                            : "text-primary-text/70"
                        }">Home</a>
                        <a href="#/history" class="no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline ${
                          currentPage === "history"
                            ? "text-primary-text font-semibold"
                            : "text-primary-text/70"
                        }">History</a>
                        <a href="#/profile" class="no-underline text-sm transition-colors duration-300 ease-in-out hover:text-primary-text hover:underline ${
                          currentPage === "profile"
                            ? "text-primary-text font-semibold"
                            : "text-primary-text/70"
                        }">Profile</a>
                    </nav>
                </div>
            </header>
        `;
  }

  // Method untuk render header berdasarkan kondisi
  render(type, currentPage = "") {
    switch (type) {
      case "auth":
        return this.renderAuthHeader();
      case "home":
        return this.renderHomeHeader();
      case "page":
        return this.renderPageHeader(currentPage);
      default:
        return this.renderHomeHeader();
    }
  }

  // Initialize slider functionality (untuk home page)
  initSlider() {
    // Auto slide
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);

    // Dot navigation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        const slideIndex = parseInt(e.target.dataset.slide);
        this.goToSlide(slideIndex);
      }
    });

    // Pause auto-slide on hover
    const slider = document.getElementById("slider");
    if (slider) {
      slider.addEventListener("mouseenter", () => {
        clearInterval(this.slideInterval);
      });

      slider.addEventListener("mouseleave", () => {
        this.slideInterval = setInterval(() => {
          this.nextSlide();
        }, 5000);
      });
    }
  }

  // Slider navigation methods
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  updateSlider() {
    const slider = document.getElementById("slider");
    const dots = document.querySelectorAll(".dot");

    if (slider) {
      slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    // Update active dot
    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add("active");
        dot.style.backgroundColor = "var(--primary-text)";
      } else {
        dot.classList.remove("active");
        dot.style.backgroundColor = "rgba(79, 52, 34, 0.7)";
      }
    });
  }

  // Clean up (stop auto-slide)
  destroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Method untuk menambahkan CSS khusus slider (jika diperlukan)
  addSliderStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .slide-1 {
                background-image: url("../public/image/flat-lay-delicious-food-plate.jpg");
            }
            .slide-2 {
                background-image: url("../public/image/different-goodies-with-copy-space.jpg");
            }
            .slide-3 {
                background-image: url("../public/image/measuring-tape-near-slices-fruit-crisp-bread.jpg");
            }
            .slide-overlay {
                background: rgba(255, 223, 100, 0.5);
                box-shadow: inset 0 0 200px rgba(255, 200, 0, 0.4);
            }
        `;
    document.head.appendChild(style);
  }
}

// Usage examples:
/*
// Untuk halaman Sign In/Sign Up
const authHeader = new Header();
document.getElementById('header-container').innerHTML = authHeader.render('auth');

// Untuk halaman Home
const homeHeader = new Header();
document.getElementById('header-container').innerHTML = homeHeader.render('home');
homeHeader.addSliderStyles(); // Tambahkan CSS slider
homeHeader.initSlider(); // Initialize slider functionality

// Untuk halaman Profile
const profileHeader = new Header();
document.getElementById('header-container').innerHTML = profileHeader.render('page', 'profile');

// Untuk halaman History
const historyHeader = new Header();
document.getElementById('header-container').innerHTML = historyHeader.render('page', 'history');

// Jangan lupa untuk setup Tailwind config dengan custom colors:
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary-bg': '#feffd8',
                'primary-text': '#4f3422',
                'accent-green': '#9bcf53',
                'accent-yellow': '#ffdf64'
            },
            fontFamily: {
                'cal-sans': ['"Cal Sans"', 'sans-serif']
            }
        }
    }
}
*/

// Export untuk penggunaan sebagai module
if (typeof module !== "undefined" && module.exports) {
  module.exports = Header;
}

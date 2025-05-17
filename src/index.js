// Fungsi untuk slider gambar
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlides() {
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    document.querySelector('.slider').style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        if (index === slideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    setTimeout(showSlides, 5000); // Ganti slide setiap 5 detik
}

function currentSlide(n) {
    slideIndex = n;
    document.querySelector('.slider').style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        if (index === slideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Mulai slider otomatis
setTimeout(showSlides, 5000);
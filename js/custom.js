document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".counter");
  const hasAnimated = Array(counters.length).fill(false);

  window.addEventListener("scroll", function () {
    counters.forEach((counter, index) => {
      if (hasAnimated[index]) return;

      const counterTop = counter.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (counterTop < windowHeight - 100) {
        const duration = 1000;
        const startTime = performance.now();

        const targetNumber = parseInt(counter.innerText.replace("+", ""));
        const circle = counter.closest(".circle");
        const svg = circle.querySelector(".progress-ring");
        const fill = svg.querySelector(".progress-ring-fill");
        const percent = +svg.getAttribute("data-percent");
        const radius = 110;
        const circumference = 2 * Math.PI * radius;

        fill.style.strokeDasharray = `${circumference}`;
        fill.style.strokeDashoffset = `${circumference}`;

        function animate(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const currentNumber = Math.floor(progress * targetNumber);
          counter.innerText = `${currentNumber}+`;

          const currentPercent = progress * percent;
          const offset = circumference * (1 - currentPercent / 100);
          fill.style.strokeDashoffset = `${offset}`;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.innerText = `${targetNumber}+`;
            fill.style.strokeDashoffset = `${circumference * (1 - percent / 100)
              }`;
          }
        }

        requestAnimationFrame(animate);
        hasAnimated[index] = true;
      }
    });
  });
});

(function () {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const closeMenu = document.getElementById("close-menu");
  const offcanvasMenu = document.getElementById("offcanvas-menu");
  const overlay = document.getElementById("overlay");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 120;
    navbar.classList.toggle("fixed", scrolled);
    navbar.classList.toggle("top-0", scrolled);
    navbar.classList.toggle("inset-x-0", scrolled);
    navbar.classList.toggle("backdrop-blur-xs", scrolled);
    navbar.classList.toggle("border-solid", scrolled);
    navbar.classList.toggle("border-b", scrolled);
    navbar.classList.toggle("border-[var(--c1)]", scrolled);
    navbar.classList.toggle("bg-[var(--c1)]/50", scrolled);
    navbar.classList.toggle("relative", !scrolled);
  });

  function openOffcanvas() {
    offcanvasMenu.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closeOffcanvas() {
    offcanvasMenu.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  menuToggle.addEventListener("click", openOffcanvas);
  closeMenu.addEventListener("click", closeOffcanvas);
  overlay.addEventListener("click", closeOffcanvas);
})();

(function () {
  const btn = document.getElementById("dropdown-btn");
  const menu = document.getElementById("dropdown-menu");
  const caret = document.getElementById("dropdown-caret");
  const root = document.getElementById("dropdown-root");
  let open = false;

  function openMenu() {
    if (open) return;
    open = true;
    btn.setAttribute("aria-expanded", "true");
    menu.classList.remove("opacity-0", "scale-95", "pointer-events-none");
    menu.classList.add("opacity-100", "scale-100", "pointer-events-auto");
    caret.style.transform = "rotate(180deg)";
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
  }

  function closeMenu() {
    if (!open) return;
    open = false;
    btn.setAttribute("aria-expanded", "false");
    menu.classList.remove("opacity-100", "scale-100", "pointer-events-auto");
    menu.classList.add("opacity-0", "scale-95", "pointer-events-none");
    caret.style.transform = "";
    document.removeEventListener("mousedown", onDocClick);
    document.removeEventListener("keydown", onKeyDown);
  }

  function toggleMenu() {
    open ? closeMenu() : openMenu();
  }
  function onDocClick(e) {
    if (!root.contains(e.target)) closeMenu();
  }
  function onKeyDown(e) {
    if (e.key === "Escape") closeMenu();
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  menu
    .querySelectorAll('[role="menuitem"]')
    .forEach((item) => item.addEventListener("click", closeMenu));
})();

(function () {
  const slider = document.getElementById("custom-slider");
  const slides = Array.from(slider.querySelectorAll(".custom-slider-item"));
  let currentIndex = 0;
  let autoSlideInterval = null;
  const slideDuration = 5000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("opacity-100", isActive);
      slide.classList.toggle("opacity-0", !isActive);
      slide.classList.toggle("pointer-events-auto", isActive);
      slide.classList.toggle("pointer-events-none", !isActive);

      const localDots = Array.from(
        slide.querySelectorAll(".custom-slider-nav-item")
      );
      localDots.forEach((dot, di) => {
        dot.classList.toggle("bg-[var(--c5)]", di === index);
        dot.classList.toggle("bg-[var(--c5)]/50", di !== index);
      });
    });

    currentIndex = index;
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % slides.length);
    resetAutoSlide();
  }
  function prevSlide() {
    showSlide((currentIndex - 1 + slides.length) % slides.length);
    resetAutoSlide();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => nextSlide(), slideDuration);
  }
  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  slides.forEach((slide) => {
    const localDots = Array.from(
      slide.querySelectorAll(".custom-slider-nav-item")
    );
    localDots.forEach((dot, idx) => {
      const targetIndex = idx % slides.length;
      dot.addEventListener("click", () => {
        showSlide(targetIndex);
        resetAutoSlide();
      });
    });
  });

  slides.forEach((slide) => {
    const nextBtn = slide.querySelector(".next-slide");
    const prevBtn = slide.querySelector(".prev-slide");
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  });

  let touchStartX = 0;
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoSlide();
  });
  slider.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    startAutoSlide();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAutoSlide();
        else stopAutoSlide();
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(slider);

  showSlide(0);
  startAutoSlide();
})();

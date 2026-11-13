import '../styles/main.css';
import { initLightbox } from './modules/lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const headerEl = document.querySelector('.header');
  const footerEl = document.querySelector('.footer');
  const root = document.documentElement;

  // Измеряем высоту шапки и подвала
  const setChromeHeights = () => {
    if (headerEl) root.style.setProperty('--header-height', `${headerEl.offsetHeight}px`);
    if (footerEl) root.style.setProperty('--footer-height', `${footerEl.offsetHeight}px`);
  };

  setChromeHeights();
  window.addEventListener('resize', setChromeHeights);
  if (document.fonts?.ready) {
    document.fonts.ready.then(setChromeHeights);
  }

  // Мобильное меню 
  if (burger && nav) {
    const toggleMenu = (open) => {
      const isOpen = open ?? !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('overflow-hidden', isOpen);

      if (isOpen) {
        headerEl.style.zIndex = '9999';
        headerEl.classList.remove('is-hidden');
      } else {
        headerEl.style.zIndex = '';
      }

      setTimeout(setChromeHeights, 50);
    };

    burger.addEventListener('click', () => toggleMenu());
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu(false);
        burger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  // Автоскрытие шапки 
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (nav?.classList.contains('is-open')) {
      ticking = false;
      return;
    }

    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    const nearTop = currentScrollY < 100;

    if (nearTop) {
      headerEl?.classList.remove('is-hidden');
    } else if (delta > 5) {
      headerEl?.classList.add('is-hidden');
    } else if (delta < -5) {
      headerEl?.classList.remove('is-hidden');
    }

    headerEl?.classList.toggle('is-scrolled', currentScrollY > 10);
    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateHeader();

  // Слайдер в Hero-секции 
  const slider = document.getElementById('hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.hero__slide');
    const btnPrev = document.getElementById('hero-prev');
    const btnNext = document.getElementById('hero-next');
    let currentSlide = 0;
    let slideInterval;
    let isAnimating = false;

    const goToSlide = (index) => {
      if (isAnimating) return;
      isAnimating = true;
      slides.forEach((s) => s.classList.remove('is-active'));
      slides[index].classList.add('is-active');
      currentSlide = index;
      setTimeout(() => {
        isAnimating = false;
      }, 700);
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

    const startAutoPlay = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 3500);
    };
    const stopAutoPlay = () => clearInterval(slideInterval);

    btnNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
    btnPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    let startX = 0;
    let isDragging = false;

    const handleDragStart = (e) => {
      startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      isDragging = true;
      stopAutoPlay();
    };

    const handleDragEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    };

    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    slider.addEventListener('touchstart', handleDragStart, { passive: true });
    slider.addEventListener('touchend', handleDragEnd);

    startAutoPlay();
  }

  // Прокрутка плёнки кнопками 
  const filmTrack = document.getElementById('filmTrack');
  const filmPrev = document.getElementById('filmPrev');
  const filmNext = document.getElementById('filmNext');

  if (filmTrack && filmPrev && filmNext) {
    const getScrollAmount = () => {
      const frame = filmTrack.querySelector('.filmstrip__frame');
      if (!frame) return 400;
      const style = window.getComputedStyle(frame);
      return frame.offsetWidth + parseInt(style.marginRight || 0) + 24;
    };

    filmNext.addEventListener('click', () => {
      filmTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
    filmPrev.addEventListener('click', () => {
      filmTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    const updateButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = filmTrack;
      filmPrev.disabled = scrollLeft <= 10;
      filmNext.disabled = scrollLeft + clientWidth >= scrollWidth - 10;
    };

    filmTrack.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
    window.addEventListener('resize', updateButtons);
  }

  // Плавная прокрутка к якорям
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  initLightbox();   
});
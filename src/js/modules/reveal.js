export const initRevealAnimations = () => {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Перестаем следить за элементом, чтобы анимация не повторялась при скролле
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.5, // Анимация сработает, когда 25% элемента появится на экране
    rootMargin: '0px 0px -50px 0px' // ускоряем срабатывание
  });

  reveals.forEach(el => observer.observe(el));
};
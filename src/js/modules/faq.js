export const initFaqAccordion = () => {
  // переключение категорий
  const tabs = document.querySelectorAll('.faq-tab');
  const categories = document.querySelectorAll('.faq-category');
  
  if (tabs.length > 0 && categories.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-category');

        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });

        // Скрываем все категории
        categories.forEach((cat) => {
          cat.classList.remove('is-active');
        });

        // Активируем выбранную категорию
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        
        const activeCategory = document.querySelector(
          `.faq-category[data-category="${targetCategory}"]`
        );
        if (activeCategory) {
          activeCategory.classList.add('is-active');
        }

        // Закрываем все открытые вопросы при смене категории
        document.querySelectorAll('.faq-item.is-open').forEach((item) => {
          item.classList.remove('is-open');
          const btn = item.querySelector('.faq-item__question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          const answer = item.querySelector('.faq-item__answer');
          if (answer) answer.style.maxHeight = null;
        });
      });
    });
  }

  // раскрытие вопросов
  const questions = document.querySelectorAll('.faq-item__question');
  if (questions.length === 0) return;

  questions.forEach((question) => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-item__answer');
      const isOpen = item.classList.contains('is-open');

      // Переключаем текущий вопрос
      item.classList.toggle('is-open');
      question.setAttribute('aria-expanded', !isOpen);

      // Плавная анимация высоты
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
};
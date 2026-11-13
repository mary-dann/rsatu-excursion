export const initLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('#lightboxImg');
  const lightboxCaption = lightbox.querySelector('#lightboxCaption');
  const lightboxCounter = lightbox.querySelector('#lightboxCounter');
  const closeBtn = lightbox.querySelector('#lightboxClose');
  const overlay = lightbox.querySelector('#lightboxOverlay');
  const prevBtn = lightbox.querySelector('#lightboxPrev');
  const nextBtn = lightbox.querySelector('#lightboxNext');

  // Собираем все фото из плёнки кроме карточки "+"
  const frames = Array.from(
    document.querySelectorAll('.filmstrip__frame:not(.filmstrip__frame--more)')
  );

  if (frames.length === 0) return;

  const photos = frames.map((frame) => {
    const img = frame.querySelector('.filmstrip__img');
    const caption = frame.querySelector('.filmstrip__caption');
    return {
      src: img?.src || '',
      alt: img?.alt || '',
      caption: caption?.textContent?.trim() || '',
    };
  });

  let currentIndex = 0;

  // Показать фото по индексу
  const showPhoto = (index) => {
    // Циклическая навигация: после последнего — первое, и наоборот
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = photo.caption;
    lightboxCounter.textContent = `${currentIndex + 1} из ${photos.length}`;

    // Перезапускаем анимацию появления
    lightboxImg.style.animation = 'none';
    void lightboxImg.offsetWidth;
    lightboxImg.style.animation = '';
  };

  const openLightbox = (index) => {
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add('overflow-hidden');
    // Фокус на кнопку закрытия для доступности
    setTimeout(() => closeBtn?.focus(), 50);
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('overflow-hidden');
    // Возвращаем фокус на фото, с которого открыли
    const frame = frames[currentIndex];
    const img = frame?.querySelector('.filmstrip__img');
    img?.focus();
  };

  const nextPhoto = () => showPhoto(currentIndex + 1);
  const prevPhoto = () => showPhoto(currentIndex - 1);

  // Клик по фото в плёнке — открыть лайтбокс
  frames.forEach((frame, index) => {
    const img = frame.querySelector('.filmstrip__img');
    if (!img) return;

    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Открыть фото: ${img.alt}`);

    img.addEventListener('click', () => openLightbox(index));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Кнопки управления
  closeBtn?.addEventListener('click', closeLightbox);
  overlay?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', prevPhoto);
  nextBtn?.addEventListener('click', nextPhoto);

  // Клавиатура
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevPhoto();
        break;
      case 'ArrowRight':
        nextPhoto();
        break;
    }
  });

  // Свайп на мобильных
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    'touchend',
    (e) => {
      const diffX = touchStartX - e.changedTouches[0].screenX;
      const diffY = touchStartY - e.changedTouches[0].screenY;

      // Свайп только если горизонтальное движение больше вертикального
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) nextPhoto();
        else prevPhoto();
      }
    },
    { passive: true }
  );
};
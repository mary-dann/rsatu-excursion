import '../styles/main.css';

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    const toggleMenu = (open) => {
        const isOpen = open ?? !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
        // блокируем скролл body, пока меню открыто (опционально)
        document.body.classList.toggle('overflow-hidden', isOpen);
    };

    burger.addEventListener('click', () => toggleMenu());

    // Закрытие по клику на ссылку (чтобы меню не висело после перехода)
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            toggleMenu(false);
            burger.focus();
        }
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('is-open') &&
            !nav.contains(e.target) &&
            !burger.contains(e.target)) {
            toggleMenu(false);
        }
    });
}
export function initHeaderMenu() {
    document.addEventListener('DOMContentLoaded', function () {
        const burger = document.querySelector('.header__burger');
        const overlay = document.getElementById('header-overlay');

        if (!burger || !overlay) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'header__backdrop';

        document.body.append(backdrop, overlay);

        const toggle = (open, options = {}) => {
            const { restoreFocus = true } = options;
            const isOpen = typeof open === 'boolean' ? open : !overlay.classList.contains('is-open');
            overlay.classList.toggle('is-open', isOpen);
            backdrop.classList.toggle('is-visible', isOpen);
            overlay.setAttribute('aria-hidden', String(!isOpen));
            burger.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                const firstLink = overlay.querySelector('a');
                if (firstLink) firstLink.focus();
            } else if (restoreFocus) {
                burger.focus();
            }
        };

        burger.addEventListener('click', () => toggle());

        backdrop.addEventListener('click', () => toggle(false));

        overlay.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (target) toggle(false, { restoreFocus: false });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                toggle(false);
            }
        });
    });
}
(function () {
    'use strict';

    const DEFAULT_PAGE = 'home';
    const PAGE_IDS = [
        'home', 'glossary', 'body-elements', 'object-elements', 'da',
        'gymnasts-august', 'gymnasts-apparatus', 'gymnastics-prep',
        'gymnastics-check', 'validation', 'sources'
    ];

    function normalizeHash(hash) {
        const id = (hash || '').replace(/^#/, '');
        return PAGE_IDS.includes(id) ? id : DEFAULT_PAGE;
    }

    // --- ИКОНКИ: ФОЛБЭК ---
    (function checkIcons() {
        const icons = [
            { file: 'icon/home.png',          cls: '.icon-home' },
            { file: 'icon/gimnastka.png',     cls: '.icon-gymnast' },
            { file: 'icon/ball.png',          cls: '.icon-ball' },
            { file: 'icon/Knowledgebase.png', cls: '.icon-knowledgebase' },
            { file: 'icon/Projects.png',      cls: '.icon-projects' },
            { file: 'icon/Copyright.png',     cls: '.icon-copyright' },
            { file: 'icon/Glossary.png',      cls: '.icon-glossary' },
            { file: 'icon/GymnastsAugust.png',cls: '.icon-gymnasts-august' },
            { file: 'icon/Validation.png',    cls: '.icon-validation-new' }
        ];
        icons.forEach(({ file, cls }) => {
            const img = new Image();
            img.onerror = () => {
                document.querySelectorAll(cls).forEach(el => {
                    if (el.parentElement) el.parentElement.classList.add('img-failed');
                });
            };
            img.src = file;
        });
    })();

    // --- УПРАВЛЕНИЕ ВЫПАДАЮЩИМИ ОКНАМИ ---
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let closeTimeout;

    function positionFlyout(details) {
        const summary = details.querySelector('summary');
        const subNav = details.querySelector('.sub-nav');
        if (summary && subNav) {
            const rect = summary.getBoundingClientRect();
            subNav.style.top = `${rect.top}px`;
            subNav.style.left = `${rect.right + 15}px`;
        }
    }

    function openFlyout(details) {
        clearTimeout(closeTimeout);
        // Закрываем другие открытые окна
        document.querySelectorAll('details.nav-group').forEach(d => {
            if (d !== details) d.removeAttribute('open');
        });
        
        // Открываем нужное и позиционируем
        if (!details.hasAttribute('open')) {
            details.setAttribute('open', '');
            positionFlyout(details);
        }
    }

    function closeAllFlyouts() {
        document.querySelectorAll('details.nav-group').forEach(d => d.removeAttribute('open'));
    }

    if (isDesktop) {
        // Логика для ПК (наведение с задержкой)
        document.querySelectorAll('details.nav-group').forEach(details => {
            details.addEventListener('mouseenter', () => openFlyout(details));
            details.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(closeAllFlyouts, 150);
            });
            
            // Блокируем клик на десктопе, чтобы не срабатывало стандартное поведение details
            const summary = details.querySelector('summary');
            if (summary) summary.addEventListener('click', (e) => e.preventDefault());
        });
    } else {
        // Логика для мобильных (клик)
        document.querySelectorAll('details.nav-group').forEach(details => {
            const summary = details.querySelector('summary');
            if (!summary) return;

            summary.addEventListener('click', (e) => {
                e.preventDefault();
                if (details.hasAttribute('open')) {
                    closeAllFlyouts();
                } else {
                    openFlyout(details);
                }
            });
        });
    }

    // --- ГРУППЫ ---
    function syncGroupsWithActive() {
        document.querySelectorAll('details.nav-group').forEach(group => {
            const hasActive = !!group.querySelector('.sub-nav .nav-btn.active');
            group.classList.toggle('has-active', hasActive);
        });
    }

    // --- НАВИГАЦИЯ ---
    function renderPage(pageId) {
        const id = PAGE_IDS.includes(pageId) ? pageId : DEFAULT_PAGE;

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + id);
        if (target) target.classList.add('active');

        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
            const isActive = btn.dataset.page === id;
            btn.classList.toggle('active', isActive);
            if (isActive) btn.setAttribute('aria-current', 'page');
            else btn.removeAttribute('aria-current');
        });

        syncGroupsWithActive();

        const titleEl = target && target.querySelector('h1');
        if (titleEl) {
            const titleText = titleEl.textContent.trim().replace(/\s+/g, ' ');
            document.title = `${titleText} — Разметка гимнасток`;
        }
    }

    function navigate(pageId, opts = {}) {
        const id = PAGE_IDS.includes(pageId) ? pageId : DEFAULT_PAGE;
        const { scroll = true, replaceHash = false } = opts;

        if (normalizeHash(location.hash) !== id) {
            const newHash = '#' + id;
            if (replaceHash) {
                history.replaceState(null, '', newHash);
                renderPage(id);
            } else {
                location.hash = newHash;
            }
        } else {
            renderPage(id);
        }

        if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
        
        closeAllFlyouts(); 
    }

    // --- ОБРАБОТЧИКИ ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate(link.dataset.page);
            return;
        }

        if (e.target.closest('details.nav-group') === null) {
            closeAllFlyouts();
        }
    });

    window.addEventListener('hashchange', () => {
        const id = normalizeHash(location.hash);
        renderPage(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllFlyouts();
        }
    });

    // --- СТАРТ ---
    document.addEventListener('DOMContentLoaded', () => {
        const initialId = normalizeHash(location.hash);
        if (!location.hash || initialId !== location.hash.replace(/^#/, '')) {
            history.replaceState(null, '', '#' + initialId);
        }
        renderPage(initialId);
        window.scrollTo({ top: 0 });
    });

    window.navigate = navigate;
})();
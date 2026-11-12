/* =========================================================
   РАЗМЕТКА ГИМНАСТОК — script.js
   ========================================================= */

(function () {
    'use strict';

    // --- КОНСТАНТЫ ---
    const MOBILE_BP = 900; 
    const DEFAULT_PAGE = 'home';
    const PAGE_IDS = [
        'home',
        'glossary',
        'body-elements',
        'object-elements',
        'da',
        'gymnasts-august',
        'gymnasts-apparatus',
        'gymnastics-prep',
        'gymnastics-check',
        'validation',
        'sources'
    ];

    // --- DOM-ССЫЛКИ ---
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // --- УТИЛИТЫ ---
    const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches;

    function normalizeHash(hash) {
        const id = (hash || '').replace(/^#/, '');
        return PAGE_IDS.includes(id) ? id : DEFAULT_PAGE;
    }

    // --- ИКОНКИ: ФОЛБЭК ---
    (function checkIcons() {
        const icons = [
            { file: 'home.png',      cls: '.icon-home' },
            { file: 'gimnastka.png', cls: '.icon-gymnast' },
            { file: 'ball.png',      cls: '.icon-ball' },
            { file: 'feedback.png',  cls: '.icon-validation' }
        ];

        icons.forEach(({ file, cls }) => {
            const img = new Image();
            img.onerror = () => {
                document.querySelectorAll(cls).forEach(el => {
                    const wrapper = el.parentElement;
                    if (wrapper) wrapper.classList.add('img-failed');
                });
            };
            img.src = `icon/${file}`;
        });
    })();

    // --- СВЁРНУТОСТЬ МЕНЮ ---
    function setMenu(open) {
        const shouldOpen = typeof open === 'boolean' ? open : !body.classList.contains('menu-open');
        body.classList.toggle('menu-open', shouldOpen);
        if (menuToggle) menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    }

    function toggleMenu() {
        setMenu(!body.classList.contains('menu-open'));
    }

    // --- ГРУППЫ <details> ---
    function syncGroupsWithActive() {
        document.querySelectorAll('details.nav-group').forEach(group => {
            const hasActive = !!group.querySelector('.sub-nav .nav-btn.active');
            group.classList.toggle('has-active', hasActive);
            if (hasActive) group.setAttribute('open', '');
        });
    }

    // --- НАВИГАЦИЯ ---
    function renderPage(pageId) {
        const id = PAGE_IDS.includes(pageId) ? pageId : DEFAULT_PAGE;

        // Страницы
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + id);
        if (target) target.classList.add('active');

        // Кнопки меню
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
            const isActive = btn.dataset.page === id;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                btn.setAttribute('aria-current', 'page');
            } else {
                btn.removeAttribute('aria-current');
            }
        });

        syncGroupsWithActive();

        // Обновляем заголовок вкладки
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
        if (isMobile()) setMenu(false);
    }

    // --- ОБРАБОТЧИКИ ---
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (!link) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        e.preventDefault();
        navigate(link.dataset.page);
    });

    window.addEventListener('hashchange', () => {
        const id = normalizeHash(location.hash);
        renderPage(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (isMobile()) setMenu(false);
    });

    let lastIsMobile = isMobile();
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    const onBreakpointChange = () => {
        const nowMobile = isMobile();
        if (nowMobile !== lastIsMobile) {
            lastIsMobile = nowMobile;
            setMenu(!nowMobile);
        }
    };
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onBreakpointChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onBreakpointChange);
    }

    document.addEventListener('click', (e) => {
        if (!isMobile() || !body.classList.contains('menu-open')) return;
        if (!sidebar) return;
        if (sidebar.contains(e.target)) return;
        if (menuToggle && menuToggle.contains(e.target)) return;
        setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobile() && body.classList.contains('menu-open')) {
            setMenu(false);
        }
    });

    // --- СТАРТ ---
    document.addEventListener('DOMContentLoaded', () => {
        setMenu(!isMobile());
        const initialId = normalizeHash(location.hash);
        if (!location.hash || initialId !== location.hash.replace(/^#/, '')) {
            history.replaceState(null, '', '#' + initialId);
        }
        renderPage(initialId);
        window.scrollTo({ top: 0 });
    });

    window.navigate = navigate;
    window.toggleMenu = toggleMenu;
})();
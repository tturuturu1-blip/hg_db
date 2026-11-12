(function () {
    'use strict';

    const MOBILE_BP = 900;
    const DEFAULT_PAGE = 'home';
    const PAGE_IDS = [
        'home', 'glossary', 'body-elements', 'object-elements', 'da',
        'gymnasts-august', 'gymnasts-apparatus', 'gymnastics-prep',
        'gymnastics-check', 'validation', 'sources'
    ];

    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

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
                    if (el.parentElement) el.parentElement.classList.add('img-failed');
                });
            };
            img.src = `icon/${file}`;
        });
    })();

    // --- МЕНЮ ---
    function setMenu(open) {
        const shouldOpen = typeof open === 'boolean' ? open : !body.classList.contains('menu-open');
        body.classList.toggle('menu-open', shouldOpen);
        if (menuToggle) menuToggle.setAttribute('aria-expanded', String(shouldOpen));
        closeAllFlyouts(); // При смене состояния меню закрываем все всплывашки
    }

    function toggleMenu() {
        setMenu(!body.classList.contains('menu-open'));
    }

    function closeAllFlyouts() {
        document.querySelectorAll('details.nav-group').forEach(d => d.removeAttribute('open'));
    }

    // --- ПОЗИЦИОНИРОВАНИЕ FLYOUT ---
    function updateFlyoutPosition(detailsEl) {
        if (body.classList.contains('menu-open')) return; // Только для свернутого меню
        if (!detailsEl.hasAttribute('open')) return;

        const summary = detailsEl.querySelector('summary');
        const subNav = detailsEl.querySelector('.sub-nav');
        
        if (summary && subNav) {
            const rect = summary.getBoundingClientRect();
            // Позиционируем строго по вертикали кнопки, а по горизонтали справа от панели
            subNav.style.top = `${rect.top}px`;
            subNav.style.left = `${rect.right + 15}px`;
        }
    }

    // Вешаем обработчик toggle на все details
    document.querySelectorAll('details.nav-group').forEach(details => {
        details.addEventListener('toggle', () => {
            if (!body.classList.contains('menu-open')) {
                // Если открыли одну группу в свернутом режиме, закрываем остальные
                if (details.hasAttribute('open')) {
                    document.querySelectorAll('details.nav-group').forEach(other => {
                        if (other !== details) other.removeAttribute('open');
                    });
                }
                // Небольшая задержка нужна, чтобы элемент успел получить display: flex
                setTimeout(() => updateFlyoutPosition(details), 10);
            }
        });
    });

    // --- ГРУППЫ ---
    function syncGroupsWithActive() {
        document.querySelectorAll('details.nav-group').forEach(group => {
            const hasActive = !!group.querySelector('.sub-nav .nav-btn.active');
            group.classList.toggle('has-active', hasActive);
            if (hasActive && body.classList.contains('menu-open')) {
                group.setAttribute('open', '');
            }
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
        if (isMobile()) setMenu(false);
        
        closeAllFlyouts(); // Закрываем flyout при переходе
    }

    // --- ОБРАБОТЧИКИ ---
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
        // Клик по ссылке навигации
        const link = e.target.closest('[data-page]');
        if (link) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate(link.dataset.page);
            return;
        }

        // Закрытие flyout при клике вне его области
        if (!body.classList.contains('menu-open') && e.target.closest('details.nav-group') === null) {
            closeAllFlyouts();
        }
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
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onBreakpointChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onBreakpointChange);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllFlyouts();
            if (isMobile() && body.classList.contains('menu-open')) setMenu(false);
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
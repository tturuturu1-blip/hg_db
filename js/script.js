/* =========================================================
   РАЗМЕТКА ГИМНАСТОК — script.js
   - Hash-роутинг (#home, #glossary, ...)
   - Единый брейкпоинт 900px (совпадает с CSS)
   - Доступность: aria-expanded / aria-current
   - Авто-раскрытие родительского <details> с активным пунктом
   - Закрытие меню на мобиле после перехода
   - Фолбэк иконок через класс .img-failed
   ========================================================= */

(function () {
    'use strict';

    // --- КОНСТАНТЫ ---
    const MOBILE_BP = 900; // синхронно с @media (max-width: 900px) в style.css
    const DEFAULT_PAGE = 'home';
    const PAGE_IDS = [
        'home',
        'glossary',
        'body-elements',
        'object-elements',
        'da',
        'gymnasts-august',
        'validation'
    ];

    // --- DOM-ССЫЛКИ ---
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navRoot = document.querySelector('.sidebar-nav');

    // --- УТИЛИТЫ ---
    const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches;

    /**
     * Возвращает валидный id страницы или DEFAULT_PAGE.
     * @param {string} hash — например "#glossary"
     */
    function normalizeHash(hash) {
        const id = (hash || '').replace(/^#/, '');
        return PAGE_IDS.includes(id) ? id : DEFAULT_PAGE;
    }

    // --- ИКОНКИ: ФОЛБЭК ---
    // Если PNG-иконка не загрузилась — родителю добавляется класс .img-failed,
    // CSS отрисует текстовый маркер вместо прозрачного квадрата.
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
    /**
     * Открывает/закрывает меню и синхронизирует aria-expanded.
     * @param {boolean} [open] — если не задано, переключает.
     */
    function setMenu(open) {
        const shouldOpen = typeof open === 'boolean' ? open : !body.classList.contains('menu-open');
        body.classList.toggle('menu-open', shouldOpen);
        if (menuToggle) menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    }

    function toggleMenu() {
        setMenu(!body.classList.contains('menu-open'));
    }

    // --- ГРУППЫ <details> ---
    /** Раскрывает все родительские <details>, содержащие активный пункт, и подсвечивает их summary. */
    function syncGroupsWithActive() {
        document.querySelectorAll('details.nav-group').forEach(group => {
            const hasActive = !!group.querySelector('.sub-nav .nav-btn.active');
            group.classList.toggle('has-active', hasActive);
            if (hasActive) group.setAttribute('open', '');
        });
    }

    // --- НАВИГАЦИЯ ---
    /**
     * Показывает нужную страницу (без изменения URL — это делает hashchange/клик).
     * @param {string} pageId
     */
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

    /**
     * Переход на страницу + обновление hash + скролл наверх + (на мобиле) закрытие меню.
     * @param {string} pageId
     * @param {{ scroll?: boolean, replaceHash?: boolean }} [opts]
     */
    function navigate(pageId, opts = {}) {
        const id = PAGE_IDS.includes(pageId) ? pageId : DEFAULT_PAGE;
        const { scroll = true, replaceHash = false } = opts;

        // Меняем hash — сработает hashchange → renderPage
        if (normalizeHash(location.hash) !== id) {
            const newHash = '#' + id;
            if (replaceHash) {
                history.replaceState(null, '', newHash);
                renderPage(id);
            } else {
                location.hash = newHash; // вызовет hashchange
            }
        } else {
            renderPage(id);
        }

        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // На мобиле закрываем меню после перехода
        if (isMobile()) setMenu(false);
    }

    // --- ОБРАБОТЧИКИ ---

    // Клик по кнопке-логотипу — переключение меню
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Делегирование кликов по навигации: и ссылки меню, и карточки на главной
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (!link) return;

        // Игнорируем клики с модификаторами (открыть в новой вкладке и т.п.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        e.preventDefault();
        navigate(link.dataset.page);
    });

    // Синхронизация при ручном изменении hash или кнопках «Назад/Вперёд»
    window.addEventListener('hashchange', () => {
        const id = normalizeHash(location.hash);
        renderPage(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (isMobile()) setMenu(false);
    });

    // Реакция на изменение ширины окна — синхронизируем меню
    let lastIsMobile = isMobile();
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    const onBreakpointChange = () => {
        const nowMobile = isMobile();
        if (nowMobile !== lastIsMobile) {
            lastIsMobile = nowMobile;
            // На мобиле — свёрнуто, на десктопе — развёрнуто
            setMenu(!nowMobile);
        }
    };
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onBreakpointChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onBreakpointChange); // Safari < 14
    }

    // Клик вне сайдбара (на мобиле) — закрыть меню
    document.addEventListener('click', (e) => {
        if (!isMobile() || !body.classList.contains('menu-open')) return;
        if (!sidebar) return;
        if (sidebar.contains(e.target)) return;
        if (menuToggle && menuToggle.contains(e.target)) return;
        setMenu(false);
    });

    // Escape — закрыть меню на мобиле (и вообще вернуть в свёрнутое на мобиле)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobile() && body.classList.contains('menu-open')) {
            setMenu(false);
        }
    });

    // --- СТАРТ ---
    document.addEventListener('DOMContentLoaded', () => {
        // Начальное состояние меню по ширине экрана
        setMenu(!isMobile());

        // Если в URL есть валидный hash — открываем соответствующую страницу,
        // иначе — дефолтную (и фиксируем её в URL через replaceState, чтобы не плодить историю).
        const initialId = normalizeHash(location.hash);
        if (!location.hash || initialId !== location.hash.replace(/^#/, '')) {
            history.replaceState(null, '', '#' + initialId);
        }
        renderPage(initialId);
        window.scrollTo({ top: 0 });
    });

    // --- ЭКСПОРТ ДЛЯ ИНЛАЙН-ВЫЗОВОВ (если понадобится из HTML) ---
    window.navigate = navigate;
    window.toggleMenu = toggleMenu;
})();
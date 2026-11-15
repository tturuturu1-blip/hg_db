/* ========================================= */
/* --- ПРОВЕРКА ЗАГРУЗКИ ИКОНОК (ФОЛБЭК) --- */
/* ========================================= */
// Обновил имена файлов в точном соответствии с вашей папкой icon
const iconFiles = ['home.png', 'gimnastka.png', 'Knowledgebase.png', 'Validation.png', 'Projects.png'];

iconFiles.forEach(file => {
    const img = new Image();
    img.src = `icon/${file}`;
    img.onerror = () => {
        const classMap = {
            'home.png': '.icon-home',
            'gimnastka.png': '.icon-gymnast',
            'Knowledgebase.png': '.icon-knowledge',
            'Validation.png': '.icon-validation',
            'Projects.png': '.icon-sources'
        };
        
        const selector = classMap[file];
        if (!selector) return;

        document.querySelectorAll(selector).forEach(el => {
            if (el.parentElement) {
                el.parentElement.classList.add('img-failed');
            }
        });
    };
});

/* ========================================= */
/* --- НАВИГАЦИЯ И МАРШРУТИЗАЦИЯ --- */
/* ========================================= */
function navigate(pageId) {
    let targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) {
        pageId = 'home';
        targetPage = document.getElementById('page-home');
    }

    // 1. Переключаем страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (targetPage) targetPage.classList.add('active');

    // 2. Обновляем активные кнопки
    document.querySelectorAll('.main-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
    });
    
    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-current', 'page');
    }

    // 3. Подсветка родительской группы
    document.querySelectorAll('details.nav-group').forEach(details => {
        const hasActiveChild = !!details.querySelector('.sub-nav .nav-btn.active');
        details.classList.toggle('has-active-child', hasActiveChild);
    });

    // 4. Закрываем открытые подменю
    document.querySelectorAll('details.nav-group[open]').forEach(details => {
        details.removeAttribute('open');
    });

    // 5. Скролл наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================================= */
/* --- ОБРАБОТЧИКИ СОБЫТИЙ --- */
/* ========================================= */
window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    navigate(pageId);
});

document.addEventListener('DOMContentLoaded', () => {
    const initialPageId = window.location.hash.replace('#', '') || 'home';
    navigate(initialPageId);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('details.nav-group')) {
        document.querySelectorAll('details.nav-group[open]').forEach(details => {
            details.removeAttribute('open');
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('details.nav-group[open]').forEach(details => {
            details.removeAttribute('open');
        });
    }
});
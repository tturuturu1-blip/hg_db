/* --- Проверка загрузки PNG-иконок (фолбэк в CSS через .img-failed) --- */
const iconFiles = ['home.png', 'gimnastka.png', 'ball.png', 'feedback.png'];
iconFiles.forEach(file => {
    const img = new Image();
    img.src = `icon/${file}`;
    img.onerror = () => {
        const classMap = {
            'home.png': '.icon-home',
            'gimnastka.png': '.icon-gymnast',
            'ball.png': '.icon-ball',
            'feedback.png': '.icon-validation'
        };
        const selector = classMap[file];
        if (!selector) return;
        document.querySelectorAll(selector).forEach(el => {
            if (el.parentElement) el.parentElement.classList.add('img-failed');
        });
    };
});

/* --- Навигация через hash --- */
function navigate(pageId) {
    let targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) {
        pageId = 'home';
        targetPage = document.getElementById('page-home');
    }

    // Переключаем страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    targetPage.classList.add('active');

    // Снимаем/ставим active на пунктах
    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
    });
    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-current', 'page');
    }

    // Подсветка родительской группы, если активен дочерний пункт
    document.querySelectorAll('details.nav-group').forEach(details => {
        const hasActive = !!details.querySelector('.sub-nav .nav-btn.active');
        details.classList.toggle('has-active-child', hasActive);
    });

    // Всегда закрываем открытые подменю после перехода
    document.querySelectorAll('details.nav-group[open]').forEach(d => {
        d.removeAttribute('open');
    });

    // Скролл наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- Реакция на изменение hash --- */
window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    navigate(pageId);
});

/* --- Инициализация при загрузке --- */
document.addEventListener('DOMContentLoaded', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    navigate(pageId);
});

/* --- Закрытие подменю по клику вне details --- */
document.addEventListener('click', (e) => {
    if (!e.target.closest('details.nav-group')) {
        document.querySelectorAll('details.nav-group[open]').forEach(d => {
            d.removeAttribute('open');
        });
    }
});

/* --- Закрытие подменю по Escape --- */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('details.nav-group[open]').forEach(d => {
            d.removeAttribute('open');
        });
    }
});
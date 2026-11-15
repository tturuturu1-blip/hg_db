/* ========================================= */
/* --- ПРОВЕРКА ЗАГРУЗКИ ИКОНОК (ФОЛБЭК) --- */
/* ========================================= */
const iconFiles = ['home.png', 'gimnastka.png', 'ball.png', 'feedback.png'];

iconFiles.forEach(file => {
    const img = new Image();
    img.src = `icon/${file}`;
    img.onerror = () => {
        // Сопоставляем имя файла с CSS-классом иконки
        const classMap = {
            'home.png': '.icon-home',
            'gimnastka.png': '.icon-gymnast',
            'ball.png': '.icon-ball',
            'feedback.png': '.icon-validation'
        };
        
        const selector = classMap[file];
        if (!selector) return;

        // Находим все элементы с этой иконкой и добавляем класс родителю
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
    // Если страница не найдена, перенаправляем на главную
    let targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) {
        pageId = 'home';
        targetPage = document.getElementById('page-home');
    }

    // 1. Переключаем видимость страниц
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 2. Обновляем активные классы у кнопок меню
    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
    });
    
    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-current', 'page');
    }

    // 3. Подсвечиваем родительскую группу (details), если активен дочерний пункт
    document.querySelectorAll('details.nav-group').forEach(details => {
        const hasActiveChild = !!details.querySelector('.sub-nav .nav-btn.active');
        details.classList.toggle('has-active-child', hasActiveChild);
    });

    // 4. Всегда закрываем открытые выпадающие списки после перехода
    document.querySelectorAll('details.nav-group[open]').forEach(details => {
        details.removeAttribute('open');
    });

    // 5. Скроллим страницу наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================================= */
/* --- ОБРАБОТЧИКИ СОБЫТИЙ --- */
/* ========================================= */

// Реакция на изменение hash в URL (переходы по ссылкам, кнопка "Назад")
window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    navigate(pageId);
});

// Инициализация при первой загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const initialPageId = window.location.hash.replace('#', '') || 'home';
    navigate(initialPageId);
});

// Закрытие выпадающих списков при клике вне их области
document.addEventListener('click', (e) => {
    // Если клик был не по details.nav-group и не внутри него
    if (!e.target.closest('details.nav-group')) {
        document.querySelectorAll('details.nav-group[open]').forEach(details => {
            details.removeAttribute('open');
        });
    }
});

// Закрытие выпадающих списков по нажатию клавиши Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('details.nav-group[open]').forEach(details => {
            details.removeAttribute('open');
        });
    }
});